import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import {
  fetchFarmUserDataAsync,
  fetchVaultUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { getAddress } from 'utils/addressHelpers'
import { unstake, unstakeVault, sousUnstake } from 'utils/callHelpers'
import vaultsConfig from 'config/constants/vaults'
import { useMasterchef, useSousChef, useArcherswapVault } from './useContract'
import useGasBoost from './useGasBoost'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { gasBoostedPrice } = useGasBoost()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account, gasBoostedPrice)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid, gasBoostedPrice],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const { gasBoostedPrice } = useGasBoost()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if ([0, 8].includes(sousId)) {
        const txHash = await unstake(masterChefContract, sousId, amount, account, gasBoostedPrice, decimals)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, decimals, account, gasBoostedPrice)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, masterChefContract, sousChefContract, sousId, gasBoostedPrice],
  )

  return { onUnstake: handleUnstake }
}

export const useUnstakeVault = (vaultAddress: string, stakedBalance: BigNumber) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const archerswapVaultContract = useArcherswapVault(vaultAddress)
  const vaultInfo = vaultsConfig.find((v) => getAddress(v.vaultAddresses) === vaultAddress)
  const { gasBoostedPrice } = useGasBoost()

  const handleUnstakeVault = useCallback(
    async (amount: string) => {
      const txHash = await unstakeVault(
        vaultInfo.lpSymbol === 'CORE',
        archerswapVaultContract,
        amount,
        account,
        stakedBalance.isEqualTo(new BigNumber(amount).times(new BigNumber(10).pow(18))),
        gasBoostedPrice,
      )
      dispatch(fetchVaultUserDataAsync(account))
      return txHash
    },
    [account, vaultInfo, stakedBalance, dispatch, archerswapVaultContract, gasBoostedPrice],
  )

  return { onUnstake: handleUnstakeVault }
}

export default useUnstake
