/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceState } from 'state/types'
// import { getWeb3NoAccount } from 'utils/web3'
// import { AbiItem } from 'web3-utils'
// import UniV2LPABI from 'config/abi/UniV2LP.json'
// import BigNumber from 'bignumber.js'

// const web3 = getWeb3NoAccount()

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiResponse>('prices/fetch', async () => {
  const tempData = {
    prices: {
      spirit: 0,
    },
    update_at: null,
  }

  // const dexData = await bowClient.query({
  //   query: allPricesQuery,
  //   variables: {},
  //   fetchPolicy: 'no-cache',
  // })

  // if (dexData?.data) {
  //   const tokens = dexData.data.tokens
  //   for (let i = 0; i < tokens.length; i++) {
  //     if (tokens[i].tokenDayData.length > 0) {
  //       tempData.prices[tokens[i].symbol.toLowerCase()] = tokens[i].tokenDayData[0].priceUSD
  //     }
  //   }
  // }
  const data = tempData as PriceApiResponse
  // Return normalized token names
  return {
    update_at: data.update_at,
    prices: Object.keys(data.prices).reduce((accum, token) => {
      return {
        ...accum,
        [token.toLowerCase()]: data.prices[token],
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiResponse>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.update_at
      state.data = action.payload.prices
    })
  },
})

export default pricesSlice.reducer
