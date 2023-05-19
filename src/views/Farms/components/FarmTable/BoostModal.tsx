import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, Input, Text } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { useDepositNFTCallback } from 'hooks/useKyudoNFT'
import { useFarmUser } from 'state/hooks'
import { useMasterchef } from 'hooks/useContract'

interface BoostModalProps {
  onDismiss?: () => void
  pid: number
  slot: number
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  flex-grow: 1;
  margin: 0 12px;
  margin-right: 0;
  padding: 0 8px;

  box-shadow: 0px 0px 0px 2px #eaaa08;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const Warning = styled(Text)`
  margin-bottom: 20px;
`

const StyledModalActions = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.colors.primaryDark}00;
  display: flex;
  margin: 0;
  padding: ${(props) => props.theme.spacing[4]}px 0;
  padding-bottom: 0;
  > button:first-child {
    margin-right: 20px;
  }
`

const BoostModal: React.FC<BoostModalProps> = ({ onDismiss, pid, slot }) => {
  const [id, setId] = useState('')
  const { t } = useTranslation()

  const { handleDepositNFT, pending: pendingTx } = useDepositNFTCallback()
  const { stakedBalance } = useFarmUser(pid)

  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const onDeposit = async () => {
    const slots = await masterChefContract.methods.getSlots(account, pid).call()
    /* eslint-disable no-console */
    // console.log('Slot: ', slots[slot - 1])
    if (slots[slot - 1] !== "0x0000000000000000000000000000000000000000") {
      onDismiss()
      return
    }
    await handleDepositNFT(id, slot, pid)
    onDismiss()
  }

  return (
    <Modal title={t('Stake Your NFT')} onDismiss={onDismiss}>
      {stakedBalance.gt(0) && <Warning>{t('Please withdraw all LP tokens before staking your NFT.')}</Warning>}
      <InputWrapper>
        <Text>{t('NFT ID')}</Text>
        <StyledInput value={id} onChange={(e) => setId(e.target.value)} />
      </InputWrapper>
      <StyledModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%">
          {t('Cancel')}
        </Button>
        <Button width="100%" disabled={pendingTx || !id || stakedBalance.gt(0)} onClick={onDeposit}>
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </StyledModalActions>
    </Modal>
  )
}

export default BoostModal
