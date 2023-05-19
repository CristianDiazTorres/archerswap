import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getBowContract, getFactoryContract } from 'utils/contractHelpers'
import { getWeb3NoAccountFromChain } from 'utils/web3'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'

export const useETHBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await web3.eth.getBalance(account)
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, web3, fastRefresh])

  return balance
}

export const useWcoreBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokens.wcore.address[1116], web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, web3, fastRefresh])

  return balance
}

export const useTokenAllowance = (tokenAddress: string, targetAddress: string) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.allowance(account, targetAddress).call()
      setAllowance(new BigNumber(res))
    }

    if (account && tokenAddress && targetAddress) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh, targetAddress])

  return allowance
}

export const useApprove = () => {
  const [approvePending, setApprovePending] = useState(false)
  const { account } = useWeb3React()
  const web3 = useWeb3()

  const handleApprove = useCallback(
    async (targetAddress: string, contractAddress: string) => {
      try {
        setApprovePending(true)
        const contract = getBep20Contract(contractAddress, web3)
        const tx = await contract.methods
          .approve(targetAddress, new BigNumber(2).pow(256).minus(1).toString(10))
          .send({ from: account })
        setApprovePending(false)
        return tx
      } catch (e) {
        setApprovePending(false)
        return false
      }
    },
    [web3, account],
  )

  return { onApprove: handleApprove, approvePending }
}

export const useTokenSymbol = (tokenAddress: string) => {
  const [symbol, setSymbol] = useState('')
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.symbol().call()
      setSymbol(res)
    }

    if (tokenAddress) {
      fetchBalance()
    }
  }, [tokenAddress, web3, fastRefresh])

  return symbol
}

export const useTokenDecimal = (tokenAddress: string) => {
  const [decimal, setDecimal] = useState(0)
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.decimals().call()
      setDecimal(res)
    }

    if (tokenAddress) {
      fetchBalance()
    }
  }, [tokenAddress, web3, fastRefresh])

  return decimal
}

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account && tokenAddress) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh])

  return balance
}

export const useTokenBalanceFromChain = (tokenAddress: string, chainId: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = getWeb3NoAccountFromChain(chainId)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account && tokenAddress && chainId) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh, chainId])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const bowContract = getBowContract()
      const supply = await bowContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, fastRefresh])

  return balance
}

export const useCirculatingBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const bowContract = getBowContract()
      const [tRes, res0, res1, res2] = await Promise.all([
        bowContract.methods.totalSupply().call(),
        bowContract.methods.balanceOf('0x48Db2BD42B1F8B315Ab86C24d29C43fCDa99e984').call(), // deployer
        bowContract.methods.balanceOf('0x7bf76646fbe70b13b72b0b46284f747eec5d0181').call(), // trade mining
        bowContract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call(), // burn address
      ])
      const lockedBalance = new BigNumber(res0).plus(res1).plus(res2)
      setBalance(new BigNumber(tRes).minus(lockedBalance))
    }

    fetchBalance()
  }, [web3, fastRefresh])

  return balance
}

export const usePairsLength = () => {
  const [pairsLength, setPairsLength] = useState(0)
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchPairsLength = async () => {
      const contract = getFactoryContract(web3)
      const res = await contract.methods.allPairsLength().call()
      setPairsLength(res)
    }

    fetchPairsLength()
  }, [web3, slowRefresh])

  return pairsLength
}

export default useTokenBalance
