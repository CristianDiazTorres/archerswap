import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import {
  fetchFarmUserDataAsync,
  fetchVaultUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
} from 'state/actions'
import { stake, stakeVault, sousStake, sousStakeBnb } from 'utils/callHelpers'
import vaultsConfig from 'config/constants/vaults'
import { useMasterchef, useSousChef, useArcherswapVault } from './useContract'
import useGasBoost from './useGasBoost'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { gasBoostedPrice } = useGasBoost()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account, gasBoostedPrice)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid, gasBoostedPrice],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const { gasBoostedPrice } = useGasBoost()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if ([0, 8].includes(sousId)) {
        await stake(masterChefContract, sousId, amount, account, gasBoostedPrice, decimals)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account, gasBoostedPrice)
      } else {
        await sousStake(sousChefContract, amount, decimals, account, gasBoostedPrice)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, gasBoostedPrice],
  )

  return { onStake: handleStake }
}

export const useStakeVault = (vaultAddress: string, tokenBalance: BigNumber) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const archerswapVaultContract = useArcherswapVault(vaultAddress)
  const vaultInfo = vaultsConfig.find((v) => getAddress(v.vaultAddresses) === vaultAddress)
  const { gasBoostedPrice } = useGasBoost()

  const handleStakeVault = useCallback(
    async (amount: string) => {
      const txHash = await stakeVault(
        vaultInfo.lpSymbol === 'CORE',
        archerswapVaultContract,
        amount,
        account,
        tokenBalance.isEqualTo(new BigNumber(amount).times(new BigNumber(10).pow(18))),
        gasBoostedPrice,
      )
      dispatch(fetchVaultUserDataAsync(account))
      return txHash
    },
    [account, vaultInfo, tokenBalance, dispatch, archerswapVaultContract, gasBoostedPrice],
  )

  return { onStake: handleStakeVault }
}

export default useStake
