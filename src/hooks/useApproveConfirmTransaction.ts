import { useEffect, useReducer, useRef } from 'react'
import { noop } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { useToast } from 'state/hooks'

type Web3Payload = Record<string, unknown> | null

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action =
  | { type: 'requires_approval' }
  | { type: 'approve_sending' }
  | { type: 'requires_whitelist'; payload: boolean }
  | { type: 'approve_receipt'; payload: Web3Payload }
  | { type: 'approve_error'; payload: Web3Payload }
  | { type: 'confirm_sending' }
  | { type: 'confirm_receipt'; payload: Web3Payload }
  | { type: 'confirm_error'; payload: Web3Payload }

interface State {
  approvalState: LoadingState
  isWhitelisted: boolean
  approvalReceipt: Web3Payload
  approvalError: Web3Payload
  confirmState: LoadingState
  confirmReceipt: Web3Payload
  confirmError: Web3Payload
}

const initialState: State = {
  approvalState: 'idle',
  isWhitelisted: false,
  approvalReceipt: null,
  approvalError: null,
  confirmState: 'idle',
  confirmReceipt: null,
  confirmError: null,
}

const reducer = (state: State, actions: Action): State => {
  switch (actions.type) {
    case 'requires_approval':
      return {
        ...state,
        approvalState: 'success',
      }
    case 'requires_whitelist':
      return {
        ...state,
        isWhitelisted: actions.payload,
      }
    case 'approve_sending':
      return {
        ...state,
        approvalState: 'loading',
      }
    case 'approve_receipt':
      return {
        ...state,
        approvalState: 'success',
        approvalReceipt: actions.payload,
      }
    case 'approve_error':
      return {
        ...state,
        approvalState: 'fail',
        approvalError: actions.payload,
      }
    case 'confirm_sending':
      return {
        ...state,
        confirmState: 'loading',
      }
    case 'confirm_receipt':
      return {
        ...state,
        confirmState: 'success',
        confirmReceipt: actions.payload,
      }
    case 'confirm_error':
      return {
        ...state,
        confirmState: 'fail',
        confirmError: actions.payload,
      }
    default:
      return state
  }
}

type ContractHandler = () => any

interface ApproveConfirmTransaction {
  onWhitelisted?: ContractHandler
  onApprove: ContractHandler
  onConfirm: ContractHandler
  onRequiresApproval?: () => Promise<boolean>
  onSuccess: (state: State) => void
}

const useApproveConfirmTransaction = ({
  onWhitelisted,
  onApprove,
  onConfirm,
  onRequiresApproval,
  onSuccess = noop,
}: ApproveConfirmTransaction) => {
  const { account } = useWeb3React()
  const [state, dispatch] = useReducer(reducer, initialState)
  const handlePreApprove = useRef(onRequiresApproval)
  const handleWhitelist = useRef(onWhitelisted)
  const { toastError } = useToast()

  // Check if approval is necessary, re-check if account changes
  useEffect(() => {
    if (account && handlePreApprove.current) {
      handlePreApprove.current().then((result) => {
        if (result) {
          dispatch({ type: 'requires_approval' })
        }
      })
      handleWhitelist.current().then((result) => {
        dispatch({ type: 'requires_whitelist', payload: result })
      })
    }
  }, [account, handleWhitelist, handlePreApprove, dispatch])

  return {
    isWhitelisted: state.isWhitelisted,
    isApproving: state.approvalState === 'loading',
    isApproved: state.approvalState === 'success',
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    approvalReceipt: state.approvalReceipt,
    approvalError: state.approvalError,
    confirmReceipt: state.confirmReceipt,
    confirmError: state.confirmError,
    handleApprove: () => {
      onApprove()
        .on('sending', () => {
          dispatch({ type: 'approve_sending' })
        })
        .on('receipt', (payload: Web3Payload) => {
          dispatch({ type: 'approve_receipt', payload })
        })
        .on('error', (error: Web3Payload) => {
          dispatch({ type: 'approve_error', payload: error })
          console.error('An error occurred approving transaction:', error)
          toastError('An error occurred approving transaction')
        })
    },
    handleConfirm: () => {
      onConfirm()
        .on('sending', () => {
          dispatch({ type: 'confirm_sending' })
        })
        .on('receipt', (payload: Web3Payload) => {
          dispatch({ type: 'confirm_receipt', payload })
          onSuccess(state)
        })
        .on('error', (error: Web3Payload) => {
          dispatch({ type: 'confirm_error', payload: error })
          console.error('An error occurred confirming transaction:', error)
          toastError('An error occurred confirming transaction')
        })
    },
  }
}

export default useApproveConfirmTransaction
