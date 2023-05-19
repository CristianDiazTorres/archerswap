import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { getHunterAddress } from 'utils/addressHelpers'
import hunterABI from 'config/abi/hunter.json'
import useRefresh from './useRefresh'
import { useHunter } from './useContract'

export const useHunterData = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  const [balance, setBalance] = useState(new BigNumber(0))
  const [claimableCore, setClaimableCore] = useState(new BigNumber(0))
  const [claimedCore, setClaimedCore] = useState(new BigNumber(0))

  useEffect(() => {
    const fetch = async () => {
      const calls = []
      calls.push({ address: getHunterAddress(), name: 'balanceOf', params: [account] })
      calls.push({ address: getHunterAddress(), name: 'withdrawableDividendOf', params: [account] })
      calls.push({ address: getHunterAddress(), name: 'withdrawnDividendOf', params: [account] })

      const data = await multicall(hunterABI, calls)

      setBalance(new BigNumber(data[0][0].toString()))
      setClaimableCore(new BigNumber(data[1][0].toString()))
      setClaimedCore(new BigNumber(data[2][0].toString()))
    }

    if (account) {
      fetch()
    } else {
      setBalance(new BigNumber(0))
      setClaimableCore(new BigNumber(0))
      setClaimedCore(new BigNumber(0))
    }
  }, [account, fastRefresh])

  return {
    balance,
    claimableCore,
    claimedCore,
  }
}

export const useHunterCallback = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const contract = useHunter()

  const handleClaim = useCallback(async () => {
    try {
      setPending(true)
      const tx = await contract.methods.claim().send({
        from: account,
      })
      setPending(false)
      return tx
    } catch (e) {
      // console.log("Claim had error :>> ", e)
      setPending(false)
      return false
    }
  }, [account, contract])

  const handleCompound = useCallback(async () => {
    try {
      setPending(true)
      const tx = await contract.methods.compound().send({
        from: account,
      })
      setPending(false)
      return tx
    } catch (e) {
      // console.log("Compound had error :>> ", e)
      setPending(false)
      return false
    }
  }, [account, contract])

  return { handleClaim, handleCompound, pending }
}

export default useHunterData
