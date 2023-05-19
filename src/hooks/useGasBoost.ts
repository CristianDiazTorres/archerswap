import { BigNumber } from 'bignumber.js'
import web3NoAccount from 'utils/web3'

import { useState, useEffect } from 'react'

const GAS_MULTIPLIER = 1.5
const useGasBoost = () => {
  const [gasBoostedPrice, setGasBoostedPrice] = useState(0)
  const isGasBoostEnabled = window?.localStorage?.getItem('isGasBoostEnabled') || false

  useEffect(() => {
    const fetchWeb3GasPrice = async () => {
      const web3GasPrice = await web3NoAccount.eth.getGasPrice()
      setGasBoostedPrice(
        isGasBoostEnabled === 'true'
          ? parseInt(new BigNumber(web3GasPrice).multipliedBy(GAS_MULTIPLIER).toString())
          : parseInt(new BigNumber(web3GasPrice).toString()),
      )
    }
    fetchWeb3GasPrice()
  }, [isGasBoostEnabled])

  return { gasBoostedPrice }
}
export default useGasBoost
