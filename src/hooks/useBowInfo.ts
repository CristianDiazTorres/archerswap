import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { getBowAddress, getXbowAddress } from 'utils/addressHelpers'
import { xbowStake, xbowUnstake } from 'utils/callHelpers'
import useRefresh from './useRefresh'
import { useERC20, useXbow } from './useContract'
import useGasBoost from './useGasBoost'

const useBowInfo = () => {
  const [totalLockedBow, setTotalLockedBow] = useState(new BigNumber(0))
  const [xbowRatio, setXbowRatio] = useState(new BigNumber(0))
  const [delayToWithdraw, setDelayToWithdraw] = useState(0)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const xbowContract = useXbow()
  const bowContract = useERC20(getBowAddress())

  useEffect(() => {
    const fetchInfo = async () => {
      const [res0, res1, res2] = await Promise.all([
        bowContract.methods.balanceOf(getXbowAddress()).call(),
        xbowContract.methods.xBOWForBOW(10000).call(),
        xbowContract.methods.delayToWithdraw().call(),
      ])
      setTotalLockedBow(new BigNumber(res0).div(1e18))
      setXbowRatio(new BigNumber(res1).div(1e4))
      setDelayToWithdraw(Number(res2))
    }
    fetchInfo()
  }, [account, xbowContract, bowContract, fastRefresh])

  return { totalLockedBow, xbowRatio, delayToWithdraw }
}

export const useUserInfo = () => {
  const [bowBalance, setBowBalance] = useState(new BigNumber(0))
  const [xbowBalance, setXbowBalance] = useState(new BigNumber(0))
  const [claimableAmount, setClaimableAmount] = useState(new BigNumber(0))
  const [stakedTime, setStakedTime] = useState(0)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const xbowContract = useXbow()
  const bowContract = useERC20(getBowAddress())

  useEffect(() => {
    const fetchInfo = async () => {
      const [res0, res1, res2, res3] = await Promise.all([
        bowContract.methods.balanceOf(account).call(),
        xbowContract.methods.balanceOf(account).call(),
        xbowContract.methods.BOWBalance(account).call(),
        xbowContract.methods.stakedTime(account).call(),
      ])
      setBowBalance(new BigNumber(res0))
      setXbowBalance(new BigNumber(res1))
      setClaimableAmount(new BigNumber(res2).div(1e18))
      setStakedTime(Number(res3))
    }
    if (account) {
      fetchInfo()
    }
  }, [account, xbowContract, bowContract, fastRefresh])

  return { bowBalance, xbowBalance, claimableAmount, stakedTime }
}

export const useXbowStake = () => {
  const { account } = useWeb3React()
  const xbowContract = useXbow()

  const { gasBoostedPrice } = useGasBoost()
  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await xbowStake(xbowContract, amount, account, gasBoostedPrice)
      console.info(txHash)
    },
    [account, xbowContract, gasBoostedPrice],
  )

  return { onStake: handleStake }
}

export const useXbowUnstake = () => {
  const { account } = useWeb3React()
  const xbowContract = useXbow()
  const { gasBoostedPrice } = useGasBoost()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await xbowUnstake(xbowContract, amount, account, gasBoostedPrice)
      console.info(txHash)
    },
    [account, xbowContract, gasBoostedPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useBowInfo
