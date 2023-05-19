import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { useStakeVault } from 'hooks/useStake'
import { useUnstakeVault } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface VaultCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  addLiquidityUrl?: string
  vault?: any
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<VaultCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  // pid,
  addLiquidityUrl,
  vault,
}) => {
  const { t } = useTranslation()
  const { onStake } = useStakeVault(getAddress(vault.vaultAddresses), tokenBalance)
  const { onUnstake } = useUnstakeVault(getAddress(vault.vaultAddresses), stakedBalance)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const rawCurrentBalance = getBalanceNumber(tokenBalance)
  const displayBalance = rawCurrentBalance.toLocaleString()

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button onClick={onPresentDeposit}>{t('Stake LP')}</Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
