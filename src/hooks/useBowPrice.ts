import { useEffect, useState, useCallback } from 'react'
import type {Contract} from 'web3-eth-contract'
import { getWeb3NoAccount } from 'utils/web3'
import UniV2LPABI from 'constants/abis/UniV2LP.json'
import BigNumber from 'bignumber.js'
import useBlock from './useBlock'

// const eth: Eth = web3.eth
const web3 = getWeb3NoAccount()

const CoreUSDTPairAddress = '0xd24f5b6fA3064022A07c0D5dBE875a0e1AFB4354'
const CoreUsdtPairContract: Contract = new web3.eth.Contract(UniV2LPABI as any, CoreUSDTPairAddress)

const BowCorePairAddress = '0xBb8502132C87Ee31bE0E2bC1CB8CC69374488261'
const BowCorePairContract: Contract = new web3.eth.Contract(UniV2LPABI as any, BowCorePairAddress)

const useBowPrice = () => {
  const [price, setPrice] = useState(0.25)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    try {
      const coreObj = await CoreUsdtPairContract.methods.getReserves().call()
      if (!new BigNumber(coreObj._reserve0).eq(new BigNumber(0))) {
        const corePrice = new BigNumber(coreObj._reserve1).div(coreObj._reserve0).times(1e12)
        const archerObj = await BowCorePairContract.methods.getReserves().call()
        if (!new BigNumber(archerObj._reserve0).eq(new BigNumber(0))) {
          const archerPrice = new BigNumber(archerObj._reserve1).div(archerObj._reserve0).times(corePrice)
          if (!archerPrice.isEqualTo(price)) {
            setPrice(archerPrice.toNumber())
          }
        } else {
          setPrice(0.25)
        }
      } else {
        setPrice(0.25)
      }
    } catch (e) {
      setPrice(0)
    }
  }, [price])

  useEffect(() => {
    if (CoreUsdtPairContract && BowCorePairContract) {
      fetchBalance()
    }
  }, [setPrice, fetchBalance, block])

  return price
}

export default useBowPrice
