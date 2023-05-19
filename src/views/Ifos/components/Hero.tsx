import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'archerswap-uikit'
import Container from 'components/layout/Container'
import { useTranslation } from 'contexts/Localization'

const Title = styled(Heading).attrs({ as: 'h1', size: 'xl' })`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 24px;
`

const Blurb = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
`

const StyledHero = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  padding-bottom: 40px;
  padding-top: 40px;
  margin-bottom: 32px;
`
const Hero = () => {
  const { t } = useTranslation()

  return (
    <StyledHero>
      <Container style={{ maxWidth: '1034px' }}>
        <Title>{t('BowPad')}</Title>
        <Blurb>{t('Buy new tokens with a brand new token sale model.')}</Blurb>
      </Container>
    </StyledHero>
  )
}

export default Hero
