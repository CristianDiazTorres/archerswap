import { Text } from 'archerswap-uikit'
import React from 'react'
import styled from 'styled-components'
import { usePriceHunterUsd } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'

const PriceAndSupply = () => {
  const { t } = useTranslation()
  const price = usePriceHunterUsd()

  return (
    <StyledContainer>
      <Wrapper>
        <Text style={{ fontWeight: 400 }} color="textSubtle">
          {t('Price')}:
        </Text>
        <img src="/images/assets/hunt/token-icon.png" alt="amount" />
        <Text>${price.toNumber().toFixed(4)}</Text>
      </Wrapper>
      <Wrapper>
        <Text style={{ fontWeight: 400 }} color="textSubtle">
          {t('Supply')}:
        </Text>
        <Text>1,000,000.00</Text>
      </Wrapper>
    </StyledContainer>
  )
}

export default PriceAndSupply

const StyledContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: end;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  gap: 5px;
`
