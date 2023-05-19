import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { AutoRenewIcon, Box, Button, Flex, Text } from 'archerswap-uikit'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo } from 'config/constants/types'
import { UserInfo, WalletIfoState } from '../../hooks/useGetWalletIfoData'
import BalanceInUsd from './BalanceInUsd'
import MetaLabel from './MetaLabel'

interface ClaimProps {
  ifo: Ifo
  contract: Contract
  userInfo: UserInfo
  isPendingTx: WalletIfoState['isPendingTx']
  setPendingTx: (status: boolean) => void
  offeringTokenBalance: WalletIfoState['offeringTokenBalance']
  refundingAmount: WalletIfoState['refundingAmount']
  setIsClaimed: () => void
  liquidityIsCreated: boolean
}

const AmountGrid = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 24px;
`

const DISPLAY_DECIMALS = 4

const Claim: React.FC<ClaimProps> = ({
  ifo,
  contract,
  userInfo,
  isPendingTx,
  setPendingTx,
  offeringTokenBalance,
  refundingAmount,
  setIsClaimed,
  liquidityIsCreated,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const didContribute = userInfo.amount.gt(0)
  const canClaim = !userInfo.claimed
  const { tokenSymbol, tokenDecimals, currencyDecimals } = ifo
  const contributedBalance = getBalanceNumber(userInfo.amount, currencyDecimals)
  const refundedBalance = getBalanceNumber(refundingAmount, currencyDecimals).toFixed(
    userInfo.amount.eq(0) ? 0 : DISPLAY_DECIMALS,
  )
  const rewardBalance = getBalanceNumber(offeringTokenBalance, tokenDecimals)
  const { toastError, toastSuccess } = useToast()

  const handleClaim = async () => {
    try {
      setPendingTx(true)
      await contract.methods.harvest().send({ from: account })
      setIsClaimed()
      toastSuccess('Success!', 'You have successfully claimed your rewards.')
    } catch (error) {
      toastError('Error', error?.message)
      console.error(error)
    } finally {
      setPendingTx(false)
    }
  }

  const buttonLabel = () => {
    if (!liquidityIsCreated) {
      return t('Adding Liquidity...')
    }
    if (canClaim) {
      return t('Claim')
    }

    return t('Claimed')
  }

  return (
    <>
      <AmountGrid>
        <Box>
          <Flex mb="4px">
            <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
              {ifo.currency} {t('Tokens')}
            </Text>
            <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
              {t('Committed')}
            </Text>
          </Flex>
          <Text fontSize="20px" bold color={offeringTokenBalance.gt(0) ? 'text' : 'textDisabled'}>
            {contributedBalance.toFixed(userInfo.amount.eq(0) ? 0 : DISPLAY_DECIMALS)}
          </Text>
          <MetaLabel>{canClaim ? `${refundedBalance} to reclaim` : `${refundedBalance} reclaimed`}</MetaLabel>
        </Box>
        <Box>
          <Flex mb="4px">
            <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
              {tokenSymbol}
            </Text>
            {!canClaim ? (
              <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
                Claimed
              </Text>
            ) : (
              <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
                To Claim
              </Text>
            )}
          </Flex>
          <Text fontSize="20px" bold color={offeringTokenBalance.gt(0) ? 'text' : 'textDisabled'}>
            {rewardBalance.toFixed(offeringTokenBalance.eq(0) ? 0 : DISPLAY_DECIMALS)}
          </Text>
          {canClaim && <BalanceInUsd token={tokenSymbol} balance={rewardBalance} />}
        </Box>
      </AmountGrid>
      {didContribute ? (
        <Button
          onClick={handleClaim}
          disabled={isPendingTx || !canClaim || !liquidityIsCreated}
          width="100%"
          mb="24px"
          isLoading={isPendingTx}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {buttonLabel()}
        </Button>
      ) : (
        <Button disabled width="100%" mb="24px">
          {t('Nothing to Claim')}
        </Button>
      )}
      {!liquidityIsCreated ? (
        <Text mt="4px" fontSize="14px">
          {t('Please wait until liquidity is created')}
        </Text>
      ) : (
        <Text mt="4px" fontSize="14px">
          {t('You’ll be refunded any excess tokens when you claim')}
        </Text>
      )}
    </>
  )
}

export default Claim
