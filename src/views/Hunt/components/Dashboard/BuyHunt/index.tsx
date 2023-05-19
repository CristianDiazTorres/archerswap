import React from 'react'
import { Button, Card, CardBody, Text } from 'archerswap-uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'

function BuyHunt() {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <StyledCard>
      <StyledCardBody>
        <StyledMessage>
          <img src="/images/assets/hunt/token-icon.png" alt="amount" />
          <p>{t('You need an extra 10 HUNT to gain dividends')}</p>
        </StyledMessage>
        <StyledButtonContainer>
          <a href="https://archerswap.finance/#/swap?outputCurrency=0x962d45c91e2e4f29ddc96c626976ece600908ba6">
            <Button variant="secondary" style={{ border: '1px solid #EAAA08', color: '#EAAA08', gap: 10, height: 60 }}>
              {t('Buy HUNT')} <img src="/images/assets/hunt/token-icon.png" alt="amount" />
            </Button>
          </a>
          <a
            href="https://dexscreener.com/core/0x798489bacDDf8A3c5B1C23E7c24833B349F41dED"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="secondary"
              style={{ gap: 10, padding: 10, height: 60, border: isDark ? '1px solid #29292D' : '1px solid #E5E8EC' }}
            >
              {isDark ? (
                <img src="/images/assets/hunt/falcon-icon.svg" alt="amount" />
              ) : (
                <img src="/images/assets/hunt/falcon-icon-black.svg" alt="amount" />
              )}
              <Text>{t('Price Chart')}</Text>
            </Button>
          </a>
        </StyledButtonContainer>
      </StyledCardBody>
    </StyledCard>
  )
}

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 24px;
  font-weight: bold;
  flex-direction: column-reverse;
  gap: 20px;

  div {
    font-weight: bold;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

export const StyledCard = styled(Card)`
  width: 100%;
  border: 1px solid ${({ theme }) => (theme?.isDark ? '#29292D' : '#E5E8EC')};
  a {
    width: 100%;
  }
  button {
    width: 100%;
  }
`
export const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
`

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`

const StyledMessage = styled.div`
  display: flex;
  padding: 20px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: linear-gradient(265.22deg, #ed952e 0%, #f7ce47 100%);
  border-radius: 9px;
  color: white;
`

export default BuyHunt
