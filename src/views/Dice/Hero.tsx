import React from 'react'
import styled from 'styled-components'
import { Heading } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

const Title = styled(Heading).attrs({ as: 'h1', size: 'lg' })`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 28px;
  text-transform: uppercase;
`

const Blurb = styled(Heading)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 38px;
  font-weight: 600;
  text-transform: uppercase;
`

const StyledHero = styled.div`
  background-color: ${({ theme }) => theme.colors.farming};
  background-image: url('/images/assets/dice-hero.svg');
  background-repeat: no-repeat;
  background-position: top 0 right 8.5%;
  padding: 40px 40px 40px 8.5%;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    background-position: top 0 right 10px;
    background-size: 150px 150px;
    padding: 32px 15px;
  }
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <StyledHero>
      <div>
        <Title>{t('Welcome to')}</Title>
        <Blurb>{t('Dice Game')}</Blurb>
      </div>
    </StyledHero>
  )
}

export default Hero
