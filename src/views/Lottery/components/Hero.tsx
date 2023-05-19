import React, { useContext } from 'react'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { Heading, Text } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import LotteryProgress from './LotteryProgress'

const Title = styled(Heading).attrs({ as: 'h1', size: 'xl' })`
  color: #1c1917;
  margin-bottom: 24px;
`

const Blurb = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #44403c;
`

const StyledHero = styled.div<StyledHeroProps>`
  position: relative;
`

const StyledBanner = styled.img`
  width: 100%;
  height: 100%;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`
const StyledMobileBanner = styled.img`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const StyledContainer = styled(Container)`
  position: absolute;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;

  top: 50px;
  transform: translateY(0%);

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: space-between;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    max-width: 80%;
  }
`

const LeftWrapper = styled.div`
  flex: 1;
  padding-right: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-right: 32px;
  }
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-left: 0;
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0;
    padding-left: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 32px;
  }
`

interface StyledHeroProps {
  isDark: boolean
}

const Hero = () => {
  const { t } = useTranslation()
  const { lotteryType } = useContext(PastLotteryDataContext)
  const { isDark } = useTheme()

  return (
    <StyledHero isDark={isDark}>
      <StyledMobileBanner src="/images/assets/banners/mobile_lottery_banner.png" alt="mobile_lottery_banner" />
      <StyledBanner src="/images/assets/banners/lottery_banner.png" alt="lottery_banner" />
      <StyledContainer>
        <LeftWrapper>
          <Title>{t(`The ${lotteryType.toUpperCase()} Lottery`)}</Title>
          <Blurb>{t(`Buy tickets with ${lotteryType.toUpperCase()}`)}</Blurb>
          <Blurb>{t('Win if 2, 3 or 4 of your ticket numbers match!')}</Blurb>
        </LeftWrapper>
        <RightWrapper>
          <LotteryProgress />
        </RightWrapper>
      </StyledContainer>
    </StyledHero>
  )
}

export default Hero
