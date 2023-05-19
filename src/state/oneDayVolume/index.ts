/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { GET_BLOCKS, TOTAL_VOLUME_DATA } from '../../apollo/queries'
import { blockClient, bowClient } from '../../apollo/client'
import { OneDayState } from '../types'

const initialState: OneDayState = { oneDayVolumeUSD: 0 }

export const oneDayVolumeSlice = createSlice({
  name: 'OneDayVolume',
  initialState,
  reducers: {
    setOneDayVolumePublicData: (state, action) => {
      state.oneDayVolumeUSD = parseFloat(action.payload)
    },
  },
})

// Actions
export const { setOneDayVolumePublicData } = oneDayVolumeSlice.actions

export async function splitQuery(query, localClient, vars, list) {
  let fetchedData = {}
  const skip = 0
  const end = list.length
  const sliced = list.slice(skip, end)
  const result = await localClient.query({
    query: query(...vars, sliced),
    fetchPolicy: 'cache-first',
  })
  fetchedData = {
    ...fetchedData,
    ...result.data,
  }

  return fetchedData
}

// Thunks
export const fetchOneDayVolumePublicDataAsync = () => async (dispatch) => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()

  const fetchedData = await splitQuery(GET_BLOCKS, blockClient, [], [utcOneDayBack])

  const blocks = []
  if (fetchedData) {
    Object.keys(fetchedData).forEach((key) => {
      if (fetchedData[key].length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: fetchedData[key][0].number,
        })
      }
    })
  }
  const result = await bowClient.query({
    query: TOTAL_VOLUME_DATA(),
    fetchPolicy: 'cache-first',
  })

  // fetch the historical data
  const oneDayResult = await bowClient.query({
    query: TOTAL_VOLUME_DATA(blocks[0]?.number),
    fetchPolicy: 'cache-first',
  })

  if (result?.data?.uniswapFactories[0]?.totalVolumeUSD && oneDayResult?.data?.uniswapFactories[0]?.totalVolumeUSD) {
    dispatch(
      setOneDayVolumePublicData(
        Number(result?.data?.uniswapFactories[0]?.totalVolumeUSD) -
          Number(oneDayResult?.data?.uniswapFactories[0]?.totalVolumeUSD),
      ),
    )
  }
}

export default oneDayVolumeSlice.reducer
