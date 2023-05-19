import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from 'archerswap-uikit'
import { communityFarms } from 'config/constants'
import { FarmWithStakedValue } from 'state/types'
import { provider as ProviderType } from 'web3-core'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

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
  border: 2px solid;

  border-image-source: linear-gradient(0deg, #551bce 0%, #2474ec 100%);
  border-radius: 16px;
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
  border-radius: 16px;
  box-shadow: 0px 3.5px 10px rgba(10, 14, 22, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px 0;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 24px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`
const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.textDisabled};
  margin-bottom: 12px;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  bowPrice?: BigNumber
  provider?: ProviderType
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, bowPrice, account }) => {
  const { t } = useTranslation()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const isCommunityFarm = communityFarms.includes(farm.token.symbol)
  // We assume the token name is coin pair + lp e.g. BOW-CORE LP, LINK-CORE LP,
  // NAR-BOW LP. The images should be bow-core.svg, link-core.svg, nar-bow.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()

  const totalValueFormated = farm.liquidity
    ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = farm.dual ? farm.dual.earnLabel : 'BOW  '

  const farmAPY = farm.apy && farm.apy.toLocaleString('en-US', { maximumFractionDigits: 2 })

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses: farm.quoteToken.address,
    tokenAddresses: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  return (
    <FCard>
      {/* {farm.lpSymbol.includes('BOW') && <StyledCardAccent />} */}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        isCommunityFarm={isCommunityFarm}
        farmImage={farmImage}
        tokenSymbol={farm.token.symbol}
      />
      {!removed && (
        <Flex px={24} justifyContent="space-between" alignItems="center">
          <StyledText>{t('APR')}:</StyledText>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {farm.apy ? (
              <>
                <ApyButton
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  bowPrice={bowPrice}
                  apy={farm.apy}
                  farmApr={farm.farmApr}
                  feeApr={farm.feeApr}
                />
                {farmAPY}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      <Flex px={24} justifyContent="space-between">
        <StyledText>{t('Earn')}:</StyledText>
        <Text bold>{earnLabel}</Text>
      </Flex>
      <CardActionsContainer farm={farm} account={account} addLiquidityUrl={addLiquidityUrl} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          coreScanAddress={`https://scan.coredao.org/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          addLiquidityUrl={addLiquidityUrl}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
