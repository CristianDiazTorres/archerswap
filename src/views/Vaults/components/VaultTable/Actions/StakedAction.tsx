import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon } from 'archerswap-uikit'
import BigNumber from 'bignumber.js'
import { useCountUp } from 'react-countup'
import UnlockButton from 'components/UnlockButton'
import { useWeb3React } from '@web3-react/core'
import { useVaultUser, useGetApiPrices } from 'state/hooks'
import { VaultWithStakedValue } from 'views/Vaults/components/VaultCard/VaultCard'
import { useTranslation } from 'contexts/Localization'
import { useApproveVault } from 'hooks/useApprove'
import { getBep20Contract } from 'utils/contractHelpers'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceNumber } from 'utils/formatBalance'
import { useStakeVault } from 'hooks/useStake'
import { useUnstakeVault } from 'hooks/useUnstake'
import useWeb3 from 'hooks/useWeb3'
import { getAddress } from 'utils/addressHelpers'

import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import { ActionContainer, ActionTitles, ActionContent, Earned, Subtle, Staked as Balanced } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

const Staked: React.FunctionComponent<VaultWithStakedValue> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  ...props
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const prices = useGetApiPrices()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useVaultUser(pid, props.provider)
  const { onStake } = useStakeVault(getAddress(props.vaultAddresses), tokenBalance)
  const { onUnstake } = useUnstakeVault(getAddress(props.vaultAddresses), stakedBalance)
  const web3 = useWeb3()

  let earningsBusd = 0
  let displayBalance = '?'

  const isApproved = lpSymbol === 'CORE' ? true : account && allowance && allowance.isGreaterThan(0)

  let lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  if (props.isSingle) {
    lpAddress = token.address[process.env.REACT_APP_CHAIN_ID]
  }
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses: quoteToken.address,
    tokenAddresses: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const currentBalance = getBalanceNumber(tokenBalance)

  const quoteTokenPriceUsd = prices[quoteToken.symbol.toLowerCase()]
  const totalLiquidity = new BigNumber(props.lpTotalInQuoteToken).times(quoteTokenPriceUsd)

  let lpPrice = new BigNumber(0)
  if (props.isSingle) {
    lpPrice = new BigNumber(prices[lpSymbol === 'CORE' ? 'wcore' : lpSymbol.toLowerCase()])
  } else {
    lpPrice = new BigNumber(totalLiquidity).div(props.vaultBalance)
  }

  earningsBusd = new BigNumber(currentBalance).multipliedBy(lpPrice).toNumber()
  displayBalance = currentBalance.toLocaleString()

  const { countUp, update } = useCountUp({
    start: 0,
    end: earningsBusd,
    duration: 1,
    separator: ',',
    decimals: 3,
  })
  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(earningsBusd)
  }, [earningsBusd, updateValue])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={lpSymbol} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={lpSymbol} />)

  const lpContract = getBep20Contract(lpAddress, web3)

  const { onApprove } = useApproveVault(lpContract, getAddress(props.vaultAddresses))

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Start Farming')}</Subtle>
        </ActionTitles>
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (rawStakedBalance) {
      return (
        <ActionContainer>
          <ActionTitles>
            {/* <Title>{lpSymbol} </Title> */}
            <Subtle>{t('Your wallet balance available')}</Subtle>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance}</Earned>
              <Balanced>~{countUp} USD</Balanced>
            </div>
            <IconButtonWrapper>
              <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="primary" width="14px" />
              </IconButton>
              <IconButton variant="secondary" onClick={onPresentDeposit}>
                <AddIcon color="primary" width="14px" />
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Deposit %symbol%', { symbol: lpSymbol })} </Subtle>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" onClick={onPresentDeposit} variant="secondary">
            {lpSymbol === 'BOW' ? t(`Deposit %symbol%`, { symbol: lpSymbol }) : t('Deposit LP')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{t('Enable Vault')}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
