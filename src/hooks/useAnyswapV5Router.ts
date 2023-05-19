import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
// import BigNumber from 'bignumber.js'
import { useAnyswapV5 } from './useContract'

// eslint-disable-next-line import/prefer-default-export
export const useAnySwapOutUnderlying = (router: string, setHash: (hash: string) => void) => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const routerContract = useAnyswapV5(router)

  const anySwapOutUnderlying = useCallback(
    async (anyToken: string, to: string, amount: string, toChainID: string) => {
      try {
        setPending(true)
        const tx = await routerContract.methods
          .anySwapOutUnderlying(anyToken, to, amount, toChainID)
          .send({ from: account })
          .on('error', () => {
            setPending(false)
            return null
          })
          .on('transactionHash', (hash) => {
            setHash(hash)
            return hash
          })
          .on('receipt', (result) => {
            setPending(false)
            return result
          })
        return tx
      } catch (e) {
        setPending(false)
        return false
      }
    },
    [routerContract.methods, account, setHash],
  )

  return { onAnySwapOutUnderlying: anySwapOutUnderlying, pending }
}
