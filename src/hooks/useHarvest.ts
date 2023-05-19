import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  fetchVaultUserDataAsync,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest, harvestVault } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useArcherswapStrategy } from './useContract'
import useGasBoost from './useGasBoost'

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { gasBoostedPrice } = useGasBoost()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account, gasBoostedPrice)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract, gasBoostedPrice])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { gasBoostedPrice } = useGasBoost()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account, gasBoostedPrice)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract, gasBoostedPrice])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()
  const { gasBoostedPrice } = useGasBoost()

  const handleHarvest = useCallback(async () => {
    if ([0, 8].includes(sousId)) {
      await harvest(masterChefContract, sousId, account, gasBoostedPrice)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account, gasBoostedPrice)
    } else {
      await soushHarvest(sousChefContract, account, gasBoostedPrice)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, gasBoostedPrice])

  return { onReward: handleHarvest }
}

export const useVaultHarvest = (strategyAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const archerswapStrategyContract = useArcherswapStrategy(strategyAddress)
  const { gasBoostedPrice } = useGasBoost()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvestVault(archerswapStrategyContract, account, gasBoostedPrice)
    dispatch(fetchVaultUserDataAsync(account))
    return txHash
  }, [account, dispatch, archerswapStrategyContract, gasBoostedPrice])

  return { onReward: handleHarvest }
}
