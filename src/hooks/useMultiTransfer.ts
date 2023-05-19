import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useToast } from 'state/hooks'
import { useMuti } from './useContract'

// eslint-disable-next-line import/prefer-default-export
export const useMutiTransfer = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const mutiContract = useMuti()
  const { toastError, toastSuccess } = useToast()

  const handleMulti = useCallback(
    async (addresses: string[], amounts: string[], totalAmount: BigNumber) => {
      try {
        setPending(true)
        const tx = await mutiContract.methods
          .disperseEther(addresses, amounts)
          .send({ from: account, value: totalAmount.toString() })
        toastSuccess('Success', 'Multi send done!')
        setPending(false)
        return tx
      } catch (e) {
        toastError('Error', 'Multi send failed.')
        setPending(false)
        return false
      }
    },
    [mutiContract, account, toastSuccess, toastError],
  )

  return { onMultiTransfer: handleMulti, pending }
}

// eslint-disable-next-line import/prefer-default-export
export const useTokenMutiTransfer = () => {
  const [pendingToken, setPendingToken] = useState(false)
  const { account } = useWeb3React()
  const mutiContract = useMuti()
  const { toastError, toastSuccess } = useToast()

  const handleMulti = useCallback(
    async (token: string, addresses: string[], amounts: string[]) => {
      try {
        setPendingToken(true)
        const tx = await mutiContract.methods.disperseToken(token, addresses, amounts).send({ from: account })
        toastSuccess('Success', 'Multi send done!')
        setPendingToken(false)
        return tx
      } catch (e) {
        toastError('Error', 'Multi send failed.')
        setPendingToken(false)
        return false
      }
    },
    [mutiContract, account, toastSuccess, toastError],
  )

  return { onTokenMultiTransfer: handleMulti, pendingToken }
}
