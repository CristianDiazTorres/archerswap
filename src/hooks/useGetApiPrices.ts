import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useLpTokenFromSymbol } from './useContract'
import addresses from '../constants/token/archerswap.json'

const useGetApiPrices = () => {
  const [prices, setPrices] = useState({})
  const { account, chainId } = useWeb3React()
  const usdcCoreContract: any = useLpTokenFromSymbol('usdc-core')
  // const ethUsdcContract: any = useLpTokenFromSymbol('eth-usdc')
  // const btcUsdcContract: any = useLpTokenFromSymbol('btc-usdc')

  const getLpPrice = async (contract, baseTokenSymbol, price = 1) => {
    let lpPrice = new BigNumber(0)
    const token0 = await contract.token0()
    const result = await contract.getReserves()
    const totalSupply = await contract.totalSupply()
    const address = await addresses.tokens
      .find((t) => t.symbol.toLowerCase().includes(baseTokenSymbol.toLowerCase()))
      ?.address.toLowerCase()
    
    if (token0.toLowerCase() === address) {
      lpPrice = new BigNumber(result._reserve0._hex).times(price).times(2).div(new BigNumber(totalSupply._hex))
    } else {
      lpPrice = new BigNumber(result._reserve1._hex).times(price).times(2).div(new BigNumber(totalSupply._hex))
    }
    if ((baseTokenSymbol === 'usdc' || baseTokenSymbol === 'usdt') && baseTokenSymbol !== 'dai') {
      lpPrice = lpPrice.times(10 ** 12)
    }
    if (baseTokenSymbol === 'btc') {
      lpPrice = lpPrice.times(10 ** 2)
    }
    return lpPrice.toString()
  }

  // const getEthPrice = async () => {
  //   let usdcReserve: any = 0
  //   let ethReserve: any = 0
  //   let price: any = 0

  //   const token0 = await ethUsdcContract.token0()
  //   const result = await ethUsdcContract.getReserves()

  //   if (token0 === '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664') {
  //     usdcReserve = result._reserve0.toString()
  //     ethReserve = result._reserve1.toString()
  //   } else {
  //     usdcReserve = result._reserve1.toString()
  //     ethReserve = result._reserve0.toString()
  //   }
  //   price = new BigNumber(usdcReserve)
  //     .div(ethReserve)
  //     .times(10 ** 12)
  //     .toString()
  //   return price
  // }

  // const getBtcPrice = async () => {
  //   let usdcReserve: any = 0
  //   let btcReserve: any = 0
  //   let price: any = 0

  //   const token0 = await btcUsdcContract.token0()
  //   const result = await btcUsdcContract.getReserves()

  //   if (token0 === '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664') {
  //     usdcReserve = result._reserve0.toString()
  //     btcReserve = result._reserve1.toString()
  //   } else {
  //     usdcReserve = result._reserve1.toString()
  //     btcReserve = result._reserve0.toString()
  //   }
  //   price = new BigNumber(usdcReserve)
  //     .div(btcReserve)
  //     .times(10 ** 2)
  //     .toString()
  //   return price
  // }

  const getPrices = async () => {
    let usdcReserve: any = 0
    let coreReserve: any = 0
    let price: any = 0

    const token0 = await usdcCoreContract.token0()
    const result = await usdcCoreContract.getReserves()

    if (token0 === '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664') {
      usdcReserve = result._reserve0.toString()
      coreReserve = result._reserve1.toString()
    } else {
      usdcReserve = result._reserve1.toString()
      coreReserve = result._reserve0.toString()
    }
    price = new BigNumber(usdcReserve)
      .div(coreReserve)
      .times(10 ** 12)
      .toString()
    const usdcCorePrice = await getLpPrice(usdcCoreContract, 'WCORE', price)

    setPrices({
      wcore: price,
      'usdc-core': usdcCorePrice,
      // eth: ethPrice
    })
  }

  useEffect(() => {
    if (account) {
      getPrices()
    }
    const interval = setInterval(async () => {
      if (account) {
        getPrices()
      }
    }, 10 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId])

  return prices
}

export default useGetApiPrices
