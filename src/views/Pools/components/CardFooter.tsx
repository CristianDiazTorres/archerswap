import React, { useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Flex, MetamaskIcon } from 'archerswap-uikit'
import Balance from 'components/Balance'
import { CommunityTag, CoreTag } from 'components/Tags'
import { useBlock } from 'state/hooks'
import { PoolCategory } from 'config/constants/types'
import { registerToken } from 'utils/wallet'
import { BASE_URL } from 'config'

const tags = {
  [PoolCategory.CORE]: CoreTag,
  [PoolCategory.COMMUNITY]: CommunityTag,
}

interface Props {
  projectLink: string
  decimals: number
  totalStaked: BigNumber
  tokenName: string
  tokenAddress: string
  tokenDecimals: number
  startTime: number
  endTime: number
  isFinished: boolean
  poolCategory: PoolCategory
}

const StyledFooter = styled.div<{ isFinished: boolean }>`
  border-top: 1px solid ${({ theme }) => (theme.isDark ? '#524B63' : '#E9EAEB')};
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled2' : 'primary2']};
  padding: 16px 24px;
`

const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }

  & > svg {
    margin-left: 4px;
  }
`

const Details = styled.div`
  margin-top: 24px;
`

const Row = styled(Flex)`
  align-items: center;
`

const FlexFull = styled.div`
  flex: 1;
`
const Label = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textDisabled};
`
const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`

const CardFooter: React.FC<Props> = ({
  projectLink,
  decimals,
  tokenAddress,
  totalStaked,
  tokenName,
  tokenDecimals,
  isFinished,
  startTime,
  endTime,
  poolCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const Icon = isOpen ? ChevronUp : ChevronDown

  const handleClick = () => setIsOpen(!isOpen)
  const Tag = tags[poolCategory]

  const blocksUntilStart = useMemo(() => {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    return Math.max(startTime - currentTimestamp, 0)
  }, [startTime])

  const blocksRemaining = useMemo(() => {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    return Math.max(endTime - currentTimestamp, 0)
  }, [endTime])

  const imageSrc = `${BASE_URL}/images/tokens/${tokenName.toLowerCase()}.png`

  return (
    <StyledFooter isFinished={isFinished}>
      <Row>
        <FlexFull>
          <Tag />
        </FlexFull>
        <StyledDetailsButton onClick={handleClick}>
          {isOpen ? t('Hide') : t('Details')} <Icon />
        </StyledDetailsButton>
      </Row>
      {isOpen && (
        <Details>
          <Row mb="4px">
            <FlexFull>
              <Label>{t('Total')}</Label>
            </FlexFull>
            <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(totalStaked, decimals)} />
          </Row>
          {blocksUntilStart > 0 && (
            <Row mb="4px">
              <FlexFull>
                <Label>{t('Start')}:</Label>
              </FlexFull>
              <Balance fontSize="14px" isDisabled={isFinished} value={blocksUntilStart} decimals={0} />
            </Row>
          )}
          {blocksUntilStart === 0 && blocksRemaining > 0 && (
            <Row mb="4px">
              <FlexFull>
                <Label>{t('End')}:</Label>
              </FlexFull>
              <Balance fontSize="14px" isDisabled={isFinished} value={blocksRemaining} decimals={0} />
            </Row>
          )}
          {tokenAddress && (
            <Flex mb="4px">
              <TokenLink onClick={() => registerToken(tokenAddress, tokenName, tokenDecimals, imageSrc)}>
                {t('Add to Metamask')}
              </TokenLink>
              <MetamaskIcon height={15} width={15} ml="4px" />
            </Flex>
          )}
          <TokenLink href={projectLink} target="_blank">
            {t('View Project Site')}
          </TokenLink>
        </Details>
      )}
    </StyledFooter>
  )
}

export default React.memo(CardFooter)
