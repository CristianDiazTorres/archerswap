/* eslint-disable no-await-in-loop */
import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import lotteryABI from 'config/abi/lottery.json'
import lotteryNftABI from 'config/abi/lotteryNft.json'
import multicall from './multicall'
import { getLotteryAddress, getBowAddress, getLotteryTicketAddress } from './addressHelpers'

export const fetchLotteryAllowances = async (account, lotteryType) => {
  const bowAddress = getBowAddress()
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = [
    {
      address: bowAddress,
      name: 'allowance',
      params: [account, lotteryAdress],
    },
  ]

  const [allowance] = await multicall(erc20ABI, calls)
  return new BigNumber(allowance)
}

export const fetchLotteryCurrentRoundNo = async (lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = [
    {
      address: lotteryAdress,
      name: 'getCurrentLotteryId',
      params: [],
    },
  ]

  const [currentRoundNo] = await multicall(lotteryABI, calls)
  return Number(currentRoundNo)
}

export const fetchLotteryInfo = async (roundNo, lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = [
    {
      address: lotteryAdress,
      name: 'getBasicLottoInfo',
      params: [roundNo],
    },
  ]

  const [lotteryInfo] = await multicall(lotteryABI, calls)
  return {
    lotteryID: Number(lotteryInfo[0].lotteryID),
    lotteryStatus: Number(lotteryInfo[0].lotteryStatus),
    prizePoolInBow: Number(lotteryInfo[0].prizePoolInBow),
    costPerTicket: Number(lotteryInfo[0].costPerTicket),
    prizeDistribution: lotteryInfo[0].prizeDistribution,
    startingTimestamp: Number(lotteryInfo[0].startingTimestamp),
    closingTimestamp: Number(lotteryInfo[0].closingTimestamp),
    winningNumbers: lotteryInfo[0].winningNumbers,
    winnerCounts: lotteryInfo[0].winnerCounts,
    startTicketID: Number(lotteryInfo[0].startTicketID),
    endTicketID: Number(lotteryInfo[0].endTicketID),
    claimedPrize: Number(lotteryInfo[0].claimedPrize),
  }
}

export const fetchLotteryCurrentPrize = async (roundNo, lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const lotteryInfo = await fetchLotteryInfo(roundNo, lotteryType)
  const { lotteryStatus } = lotteryInfo

  if (lotteryStatus === 4) return new BigNumber(lotteryInfo.prizePoolInBow)

  const calls = [
    {
      address: lotteryAdress,
      name: 'getPrizeForCurrentLottery',
      params: [],
    },
  ]

  const [lotteryCurrentPrize] = await multicall(lotteryABI, calls)
  return new BigNumber(lotteryCurrentPrize)
}

export const fetchLotterySize = async (lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = [
    {
      address: lotteryAdress,
      name: 'sizeOfLottery_',
      params: [],
    },
  ]

  const [lotterySize] = await multicall(lotteryABI, calls)
  return Number(lotterySize)
}

export const fetchLotteryMaxRange = async (lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = [
    {
      address: lotteryAdress,
      name: 'getMaxRange',
      params: [],
    },
  ]

  const [lotteryMaxRange] = await multicall(lotteryABI, calls)
  return Number(lotteryMaxRange)
}

export const fetchLotteryTicketData = async (account, roundNo, lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)
  const lotteryNftAdress = getLotteryTicketAddress(lotteryType)

  const calls = [
    {
      address: lotteryNftAdress,
      name: 'getUserTickets',
      params: [roundNo, account],
    },
  ]
  const [tickets] = await multicall(lotteryNftABI, calls)

  const callsForTicketNumbers = tickets[0].map((ticketNo) => {
    return {
      address: lotteryNftAdress,
      name: 'getTicketNumbers',
      params: [Number(ticketNo)],
    }
  })
  const ticketNumberDatas = await multicall(lotteryNftABI, callsForTicketNumbers)

  const callsForReward = tickets[0].map((ticketNo) => {
    return {
      address: lotteryAdress,
      name: 'getClaimableRewardForTicket',
      params: [roundNo, Number(ticketNo)],
    }
  })
  const ticketRewardData = await multicall(lotteryABI, callsForReward)

  const callsForTicketClaimStatus = tickets[0].map((ticketNo) => {
    return {
      address: lotteryNftAdress,
      name: 'getTicketClaimStatus',
      params: [Number(ticketNo)],
    }
  })
  const ticketClaimStatusData = await multicall(lotteryNftABI, callsForTicketClaimStatus)

  const ticketData = tickets[0].map((ticketNo, i) => {
    return {
      ticketNo: Number(ticketNo),
      ticketNumbers: ticketNumberDatas[i],
      ticketReward: new BigNumber(ticketRewardData[i]),
      ticketClaim: ticketClaimStatusData[i][0],
    }
  })

  return ticketData
}

export const fetchLotteryGraphData = async (startLotteryNo, endLotteryNo, lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = []
  for (let i = startLotteryNo; i <= endLotteryNo; i++) {
    calls.push({
      address: lotteryAdress,
      name: 'getBasicLottoInfo',
      params: [i],
    })
  }

  const lotteryInfo = await multicall(lotteryABI, calls)
  const idList = []
  const poolData = []
  const burnedData = []
  lotteryInfo.map((lotteryData) => {
    idList.push(Number(lotteryData[0].lotteryID))
    poolData.push(new BigNumber(Number(lotteryData[0].prizePoolInBow)).div(10 ** 18).toFixed(2))
    burnedData.push(
      new BigNumber(Number(lotteryData[0].prizePoolInBow))
        .div(10 ** 18)
        .times(lotteryData[0].prizeDistribution[0])
        .div(100)
        .toFixed(2),
    )
    return 0
  })

  return {
    idList,
    poolData,
    burnedData,
  }
}

export const fetchDiscountData = async (lotteryType) => {
  const lotteryAdress = getLotteryAddress(lotteryType)

  const calls = [
    {
      address: lotteryAdress,
      name: 'bucketOneMax_',
      params: [],
    },
    {
      address: lotteryAdress,
      name: 'bucketTwoMax_',
      params: [],
    },
    {
      address: lotteryAdress,
      name: 'discountForBucketOne_',
      params: [],
    },
    {
      address: lotteryAdress,
      name: 'discountForBucketTwo_',
      params: [],
    },
    {
      address: lotteryAdress,
      name: 'discountForBucketThree_',
      params: [],
    },
  ]

  if (lotteryAdress) {
    const [
      bucketOneMax,
      bucketTwoMax,
      discountForBucketOne,
      discountForBucketTwo,
      discountForBucketThree,
    ] = await multicall(lotteryABI, calls)
    return {
      bucketOneMax: bucketOneMax[0],
      bucketTwoMax: bucketTwoMax[0],
      discountForBucketOne: discountForBucketOne[0],
      discountForBucketTwo: discountForBucketTwo[0],
      discountForBucketThree: discountForBucketThree[0],
    }
  }

  return {
    bucketOneMax: 0,
    bucketTwoMax: 0,
    discountForBucketOne: 0,
    discountForBucketTwo: 0,
    discountForBucketThree: 0,
  }
}

export const exportLotteryInfo = async (roundNo, lotteryType) => {
  // const roundArray = [];
  const exportData = []

  // for (let i = 1; i <= roundNo; i++)
  //     roundArray.push(i)

  // await Promise.all(
  //     roundArray.map(async (i) => {
  //         const lotteryInfo = await fetchLotteryInfo(i)
  //         if (lotteryInfo.lotteryStatus === 4) {
  //             exportData.push({
  //                 lotteryNo: i,
  //                 totalPoolAmount: new BigNumber(lotteryInfo.prizePoolInBow).div(10 ** 18).toFormat(2),
  //                 match4: lotteryInfo.winnerCounts[3],
  //                 match3: lotteryInfo.winnerCounts[2],
  //                 match2: lotteryInfo.winnerCounts[1]
  //             })
  //         }
  //     })
  // )

  /* eslint-disable */
  for (let i = 1; i <= roundNo; i++) {
    const lotteryInfo = await fetchLotteryInfo(i, lotteryType)
    if (lotteryInfo.lotteryStatus === 4) {
      exportData.push({
        lotteryNo: i,
        totalPoolAmount: new BigNumber(lotteryInfo.prizePoolInBow).div(10 ** 18).toFormat(2),
        match4: lotteryInfo.winnerCounts[3],
        match3: lotteryInfo.winnerCounts[2],
        match2: lotteryInfo.winnerCounts[1],
      })
    }
  }
  /* eslint-enable */
  return exportData
}
