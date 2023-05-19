import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from 'archerswap-uikit'
import { communityVaults } from 'config/constants'
import { Vault } from 'state/types'
import { provider as ProviderType } from 'web3-core'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'

export interface VaultWithStakedValue extends Vault {
  apy?: number
  liquidity?: BigNumber
}

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 32px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`
const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.textDisabled};
`

interface VaultCardProps {
  vault: VaultWithStakedValue
  removed: boolean
  bowPrice?: BigNumber
  provider?: ProviderType
  account?: string
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, removed, account }) => {
  const { t } = useTranslation()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const isCommunityVault = communityVaults.includes(vault.token.symbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const vaultImage = vault.lpSymbol.split(' ')[0].toLocaleLowerCase()

  const totalValueFormated = vault.liquidity
    ? `$${vault.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = vault.lpSymbol && vault.lpSymbol.toUpperCase().replace('ARCHER', '')
  const earnLabel = vault.lpSymbol // vault.dual ? vault.dual.earnLabel : 'BOW  '

  const vaultApy = vault.apy && vault.apy.toLocaleString('en-US', { maximumFractionDigits: 2 })

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses: vault.quoteToken.address,
    tokenAddresses: vault.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  return (
    <FCard>
      {['BOW'].includes(vault.token.symbol) && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={vault.multiplier}
        isCommunityVault={isCommunityVault}
        vaultImage={vaultImage}
        tokenSymbol={vault.token.symbol}
        provider={vault.provider}
      />
      {!removed && (
        <Flex justifyContent="space-between" alignItems="center">
          <StyledText>{t('APY')}:</StyledText>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {vault.apy ? (
              <>
                {/* <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} cakePrice={cakePrice} apy={vault.apy} /> */}
                {vaultApy}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <StyledText>{t('Earned')}:</StyledText>
        <Text bold>{earnLabel}</Text>
      </Flex>
      <CardActionsContainer vault={vault} account={account} addLiquidityUrl={addLiquidityUrl} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          bscScanAddress={`https://bscscan.com/address/${vault.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          addLiquidityUrl={addLiquidityUrl}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default VaultCard
