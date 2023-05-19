import React from 'react'

export interface PastLotteryDataState {
  mostRecentLotteryNumber: number
  currentLotteryNumber: number
  historyError: boolean
  historyData: any
  lotteryType: string
}

export default React.createContext({
  mostRecentLotteryNumber: 0,
  historyError: false,
  historyData: {
    idList: ['1'],
    poolData: [0],
    burnedData: [0],
  },
  lotteryType: 'bow',
} as PastLotteryDataState)
