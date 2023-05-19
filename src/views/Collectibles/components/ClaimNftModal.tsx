import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useBunnySpecialContract } from 'hooks/useContract'
import { useToast } from 'state/hooks'
import { Button, InjectedModalProps, Modal, Text, Flex } from 'archerswap-uikit'
import { Nft } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'

interface ClaimNftModalProps extends InjectedModalProps {
  nft: Nft
  onSuccess: () => void
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()
  const bunnySpecialContract = useBunnySpecialContract()

  const handleConfirm = async () => {
    bunnySpecialContract.methods
      .mintNFT(nft.bunnyId)
      .send({ from: account })
      .on('sending', () => {
        setIsConfirming(true)
      })
      .on('receipt', () => {
        toastSuccess('Successfully claimed!')
        onDismiss()
        onSuccess()
      })
      .on('error', (error) => {
        console.error('Unable to claim NFT', error)
        toastError('Error', 'Unable to claim NFT, please try again.')
        setIsConfirming(false)
      })
  }

  return (
    <Modal title={t('Claim Collectible')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="space-between">
          <Text>{t('You will receive')}:</Text>
          <Text bold>{`1x "${nft.name}" Collectible`}</Text>
        </Flex>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button width="100%" onClick={handleConfirm} disabled={!account || isConfirming}>
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
