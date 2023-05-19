import { useState, useEffect, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import useBlock from './useBlock'
import { useSwapMiningContract } from './useContract'
import { useActiveWeb3React } from './index'
import { useTransactionAdder } from '../state/transactions/hooks'

export const useSwapMiningReward = () => {
  const [swapReward, setSwapReward] = useState(0)
  const block = useBlock()
  const { account } = useActiveWeb3React()
  const swapMiningContract = useSwapMiningContract()

  const fetch = useCallback(async () => {
    if (swapMiningContract) {
      try {
        const rewardObj = await swapMiningContract.getTotalUserReward(account)
        setSwapReward(new BigNumber(rewardObj[0].toString()).div(new BigNumber(1e18)).toNumber())
      } catch (e) {
        setSwapReward(0)
      }
    }
  }, [account, swapMiningContract])

  useEffect(() => {
    if (swapMiningContract) {
      fetch()
    }
  }, [setSwapReward, fetch, block, account, swapMiningContract])

  return swapReward
}

export function useTakerWithdrawCallback(): () => Promise<void> {
  const { account } = useActiveWeb3React()
  const swapMiningContract = useSwapMiningContract()
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!swapMiningContract || !account) {
      return
    }

    try {
      const txReceipt = await swapMiningContract.takerWithdraw()
      addTransaction(txReceipt, { summary: 'Withdrawal swap mining reward' })
    } catch (error) {
      console.error('Could not withdraw', error)
    }
  }, [swapMiningContract, account, addTransaction])
}

export default useSwapMiningReward
