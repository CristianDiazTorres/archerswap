import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getKyudoNftAddress, getMasterChefAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import nftAbi from 'config/abi/NFT.json'
import masterchefAbi from 'config/abi/masterchef.json'
import farms from 'config/constants/farms'
import { useKyudoNft, useMasterchef } from './useContract'
import useRefresh from './useRefresh'

const pids = farms.map((farm) => farm.pid)

export const useNFTData = () => {
  const [balance, setBalance] = useState(0)
  const [isApproved, setIsApproved] = useState(false)

  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        if (account) {
          const calls = [
            { address: getKyudoNftAddress(), name: 'balanceOf', params: [account] },
            { address: getKyudoNftAddress(), name: 'isApprovedForAll', params: [account, getMasterChefAddress()] },
          ]
          const data = await multicall(nftAbi, calls)
          setBalance(data[0][0].toString())
          setIsApproved(data[1][0])
        } else {
          setBalance(0)
          setIsApproved(false)
        }
      } catch (e) {
        console.error('Fetching nft data had error', e)
      }
    }

    fetchGlobalData()
  }, [fastRefresh, account])

  return {
    balance,
    isApproved,
  }
}

export const useApproveCallback = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const contract = useKyudoNft()

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      const tx = await contract.methods.setApprovalForAll(getMasterChefAddress(), true).send({
        from: account,
      })
      setPending(false)
      return tx
    } catch (e) {
      console.error('NFT approve had error :>> ', e)
      setPending(false)
      return false
    }
  }, [account, contract])

  return { handleApprove, pending }
}

export const useNftStakingData = () => {
  const [nftTokenIds, setNftTokenIds] = useState({})
  const [boosts, setBoosts] = useState({})

  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        if (account) {
          const calls = []
          for (let i = 0; i < pids.length; i++) {
            calls.push({ address: getMasterChefAddress(), name: 'getSlots', params: [account, pids[i]] })
          }
          for (let i = 0; i < pids.length; i++) {
            calls.push({ address: getMasterChefAddress(), name: 'getTokenIds', params: [account, pids[i]] })
          }
          for (let i = 0; i < pids.length; i++) {
            calls.push({ address: getMasterChefAddress(), name: 'getBoost', params: [account, pids[i]] })
          }

          const data = await multicall(masterchefAbi, calls)

          const _nftTokenIds = {}
          for (let i = 0; i < pids.length; i++) {
            const tempSlots = data[i]
            const tempIds = data[pids.length + i]
            const ids = []
            for (let j = 0; j < 3; j++) {
              if (tempSlots[j] !== '0x0000000000000000000000000000000000000000') {
                ids.push(tempIds[j].toString())
              } else {
                ids.push(undefined)
              }
            }
            _nftTokenIds[pids[i]] = ids
          }
          setNftTokenIds(_nftTokenIds)

          const _boosts = {}
          for (let i = 0; i < pids.length; i++) {
            _boosts[pids[i]] = data[2 * pids.length + i][0].toString()
          }
          setBoosts(_boosts)
        } else {
          setNftTokenIds({})
          setBoosts({})
        }
      } catch (e) {
        console.error('Fetching chef data had error', e)
      }
    }

    fetchGlobalData()
  }, [fastRefresh, account])

  return {
    nftTokenIds,
    boosts,
  }
}

export const useDepositNFTCallback = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const contract = useMasterchef()

  const handleDepositNFT = useCallback(
    async (tokenId, slotIndex, pid) => {
      try {
        setPending(true)
        const tx = await contract.methods.depositNFT(getKyudoNftAddress(), tokenId, slotIndex, pid).send({
          from: account,
        })
        setPending(false)
        return tx
      } catch (e) {
        console.error('Deposit NFT had error :>> ', e)
        setPending(false)
        return false
      }
    },
    [account, contract],
  )

  return { handleDepositNFT, pending }
}

export const useWithdrawNFTCallback = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const contract = useMasterchef()

  const handleWithdrawNFT = useCallback(
    async (slotIndex, pid) => {
      try {
        setPending(true)
        const tx = await contract.methods.withdrawNFT(slotIndex, pid).send({
          from: account,
        })
        setPending(false)
        return tx
      } catch (e) {
        console.error('Withdraw NFT had error :>> ', e)
        setPending(false)
        return false
      }
    },
    [account, contract],
  )

  return { handleWithdrawNFT, pending }
}
