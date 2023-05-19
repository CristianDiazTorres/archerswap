import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useLottery } from 'hooks/useContract'
import { claimReward } from 'utils/callHelpers'
import useGasBoost from './useGasBoost'

const useClaimReward = (lotteryId, lotteryType) => {
  const { account } = useWeb3React()
  const lotteryContract = useLottery(lotteryType)
  const { gasBoostedPrice } = useGasBoost()
  const handleClaimReward = useCallback(
    async (ticketIds) => {
      try {
        const tx = await claimReward(lotteryContract, lotteryId, ticketIds, account, gasBoostedPrice)
        return tx
      } catch (e) {
        return false
      }
    },
    [account, lotteryContract, lotteryId, gasBoostedPrice],
  )

  return { onClaimReward: handleClaimReward }
}

export default useClaimReward
