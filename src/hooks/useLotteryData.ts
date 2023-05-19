import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import {
  fetchLotteryCurrentRoundNo,
  fetchLotteryInfo,
  fetchLotteryCurrentPrize,
  fetchLotterySize,
  fetchLotteryMaxRange,
  fetchLotteryTicketData,
} from 'utils/fetchLotteryData'
import { getBowAddress, getLotteryAddress } from 'utils/addressHelpers'
import useRefresh from './useRefresh'
import useWeb3 from './useWeb3'
import { useERC20 } from './useContract'

export const useAllowance = (lotteryType) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const bowContract = useERC20(getBowAddress())
  const lotteryAddress = getLotteryAddress(lotteryType)

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await bowContract.methods.allowance(account, lotteryAddress).call()
      setAllowance(new BigNumber(res))
    }
    if (account && bowContract && lotteryAddress) {
      fetchAllowance()
    }
  }, [account, bowContract, lotteryAddress, fastRefresh])

  return allowance
}

export const useLotteryCurrentRoundNo = (lotteryType) => {
  const [lotteryCurrentRoundNo, setLotteryCurrentRoundNo] = useState(0)

  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const getLotteryCurrentRoundNo = async () => {
      try {
        const data = await fetchLotteryCurrentRoundNo(lotteryType)
        setLotteryCurrentRoundNo(data)
      } catch (e) {
        console.error('fetch lottery current round no had error', e)
      }
    }
    if (web3) {
      getLotteryCurrentRoundNo()
    }
  }, [web3, lotteryType, fastRefresh])

  return lotteryCurrentRoundNo
}

export const useLotteryInfo = (roundNo, lotteryType) => {
  const [lotteryInfo, setLotteryInfo] = useState(null)

  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const getLotteryInfo = async () => {
      try {
        const data = await fetchLotteryInfo(roundNo, lotteryType)
        setLotteryInfo(data)
      } catch (e) {
        console.error('fetch lottery info had error', e)
      }
    }
    if (web3 && roundNo > 0) {
      getLotteryInfo()
    }
  }, [web3, fastRefresh, roundNo, lotteryType])

  return lotteryInfo
}

export const useLotteryMetaData = (roundNo, lotteryType) => {
  const [lotteryMetaData, setLotteryMetaData] = useState(null)

  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const getLotteryMetaData = async () => {
      try {
        const lotteryCurrentPrize = await fetchLotteryCurrentPrize(roundNo, lotteryType)
        const lotterySize = await fetchLotterySize(lotteryType)
        const lotteryMaxRange = await fetchLotteryMaxRange(lotteryType)
        setLotteryMetaData({ lotteryCurrentPrize, lotterySize, lotteryMaxRange })
      } catch (e) {
        console.error('fetch lottery meta data had error', e)
      }
    }
    if (web3 && roundNo) {
      getLotteryMetaData()
    }
  }, [web3, fastRefresh, roundNo, lotteryType])

  return lotteryMetaData
}

export const useLotteryTicketData = (roundNo, lotteryType) => {
  const [lotteryTicketData, setLotteryTicketData] = useState(null)

  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const getLotteryTicketData = async () => {
      try {
        const ticketData = await fetchLotteryTicketData(account, roundNo, lotteryType)
        setLotteryTicketData(ticketData)
      } catch (e) {
        console.error('fetch lottery ticket data had error', e)
      }
    }
    if (web3 && account && roundNo) {
      getLotteryTicketData()
    }
  }, [web3, account, fastRefresh, roundNo, lotteryType])

  return lotteryTicketData
}

export const useLotteryTotalPrizeData = (roundNo, lotteryType) => {
  const [lotteryTotalPrizeData, setLotteryTotalPrizeData] = useState({ rewardTicketData: [], totalPrize: '0' })

  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const getLotteryTotalPrizeData = async () => {
      const roundArray = []
      const rewardTicketData = []
      let totalPrize = new BigNumber(0)
      let lastRoundNo = roundNo

      const data = await fetchLotteryInfo(roundNo, lotteryType)
      if (data.lotteryStatus < 4) lastRoundNo--

      for (let i = 1; i <= lastRoundNo; i++) roundArray.push(i)

      await Promise.all(
        roundArray.map(async (i) => {
          try {
            const tempRewardTicketIds = [i]
            const ticketData = await fetchLotteryTicketData(account, i, lotteryType)

            for (let j = 0; j < ticketData.length; j++) {
              if (ticketData[j].ticketReward.gt(0) && !ticketData[j].ticketClaim) {
                totalPrize = totalPrize.plus(ticketData[j].ticketReward)
                tempRewardTicketIds.push(ticketData[j].ticketNo)
              }
            }

            if (tempRewardTicketIds.length > 1) rewardTicketData.push(tempRewardTicketIds.join(','))
          } catch (e) {
            console.error('fetch lottery ticket data had error', e)
          }
        }),
      )

      /* eslint-disable */
      // for (let i = 1; i <= lastRoundNo; i++) {
      //     try {
      //         let tempRewardTicketIds = [i]
      //         const ticketData = await fetchLotteryTicketData(account, i)

      //         for (let j = 0; j < ticketData.length; j++) {
      //             if (ticketData[j].ticketReward.gt(0) && !ticketData[j].ticketClaim) {
      //                 totalPrize = totalPrize.plus(ticketData[j].ticketReward)
      //                 tempRewardTicketIds.push(ticketData[j].ticketNo)
      //             }
      //         }

      //         if (tempRewardTicketIds.length > 1)
      //             rewardTicketData.push(tempRewardTicketIds.join(','))

      //     } catch (e) {
      //         console.error("fetch lottery ticket data had error", e)
      //     }
      // }
      /* eslint-enable */

      if (totalPrize.gt(0))
        setLotteryTotalPrizeData({ rewardTicketData, totalPrize: totalPrize.div(10 ** 18).toFormat(2) })
      else setLotteryTotalPrizeData({ rewardTicketData: [], totalPrize: '0' })
    }
    if (web3 && account && roundNo > 0) {
      getLotteryTotalPrizeData()
    }
  }, [web3, account, fastRefresh, roundNo, lotteryType, setLotteryTotalPrizeData])

  return lotteryTotalPrizeData
}
