import React from 'react'
import { Modal, Flex, Text } from 'archerswap-uikit'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useBow, usePancakeRabbits, useProfile } from 'hooks/useContract'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { fetchProfile } from 'state/profile'
import { useToast } from 'state/hooks'
import { REGISTER_COST } from '../ProfileCreation/config'
import ApproveConfirmButtons from './ApproveConfirmButtons'

interface Props {
  userName: string
  tokenId: number
  account: string
  teamId: number
  minimumCakeRequired: BigNumber
  allowance: BigNumber
  onDismiss?: () => void
}

const ConfirmProfileCreationModal: React.FC<Props> = ({
  account,
  teamId,
  tokenId,
  minimumCakeRequired,
  allowance,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const profileContract = useProfile()
  const pancakeRabbitsContract = usePancakeRabbits()
  const dispatch = useDispatch()
  const { toastSuccess } = useToast()
  const bowContract = useBow()

  const {
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const response = await bowContract.methods.allowance(account, profileContract.options.address).call()
        const currentAllowance = new BigNumber(response)
        return currentAllowance.gte(minimumCakeRequired)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return bowContract.methods.approve(profileContract.options.address, allowance.toJSON()).send({ from: account })
    },
    onConfirm: () => {
      return profileContract.methods
        .createProfile(teamId, pancakeRabbitsContract.options.address, tokenId)
        .send({ from: account })
    },
    onSuccess: async () => {
      await dispatch(fetchProfile(account))
      onDismiss()
      toastSuccess('Profile created!')
    },
  })

  return (
    <Modal title="Complete Profile" onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submitting NFT to contract and confirming User Name and Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t(`${REGISTER_COST} CAKE`, { num: REGISTER_COST })}</Text>
      </Flex>
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export default ConfirmProfileCreationModal
