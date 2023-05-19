import { useState, useCallback } from 'react'
import { useActiveWeb3React } from './index'
import { useZapContract } from './useContract'

const ZERO = '0x0000000000000000000000000000000000000000'
const ZAP_ADDRESS = '0x3264D31DeE00d298D956d0C98B0B7354a042bD0A'

const useCreateLpToken = (params) => {
  const [pending, setPending] = useState(false)
  const { account }: any = useActiveWeb3React()
  const zapContract = useZapContract(ZAP_ADDRESS)

  const handleCreateLp = useCallback(async () => {
    try {
      setPending(true)
      const option: any = {
        from: account,
      }
      if (params._fromTokenAddress === ZERO) {
        option.value = params.payableAmount
      }
      if (!zapContract) {
        console.error('contract is null')
        return
      }
      await zapContract.zapIn(
        params._fromTokenAddress,
        params._amountIn,
        params._lpAddress,
        params._token0Path,
        params._token1Path,
        `${params._minPoolTokens}`,
        params._token0RouterAddress,
        params._token1RouterAddress,
        params._LPRouterAddress,
        option
      )
      setPending(false)
    } catch (e) {
      setPending(false)
    }
  }, [account, zapContract, params])

  return { onCreateLp: handleCreateLp, pending }
}

export default useCreateLpToken;