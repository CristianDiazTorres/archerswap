import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getWeb3NoAccount } from 'utils/web3'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'

const web3 = getWeb3NoAccount()

const useBalanceFromAddress = (address) => {
  const { chainId, account }: any = useActiveWeb3React()
  const [tokenBalance, setTokenBalance] = useState(new BigNumber(0))
  const tokenContract = useTokenContract(address)

  const getCoreBalance = async () => {
    const coreBalance = await web3.eth.getBalance(account)
    setTokenBalance(new BigNumber(coreBalance))
  }

  useEffect(() => {
    const getTokenInfo = async () => {
      if (!tokenContract) {
        console.error('contract is null')
        return
      }
      try {
        if (address === '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7') {
          const res = await web3.eth.getBalance(account)
          setTokenBalance(new BigNumber(res))
        } else {
          const res = await tokenContract.balanceOf(account)
          setTokenBalance(new BigNumber(res._hex))
        }
      } catch (e) {
        console.error('fetch token balance had error', e)
      }
    }
    if (account && tokenContract && address) {
      getTokenInfo()
    } else if (account) {
      getCoreBalance()
    } else {
      setTokenBalance(new BigNumber(0))
    }
    const interval = setInterval(async () => {
      if (account && tokenContract && address) {
        getTokenInfo()
      } else if (account) {
        getCoreBalance()
      } else {
        setTokenBalance(new BigNumber(0))
      }
    }, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, tokenContract, address, web3.eth])

  return tokenBalance
}

export default useBalanceFromAddress;
