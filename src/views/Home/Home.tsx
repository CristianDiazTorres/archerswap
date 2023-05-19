import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from 'archerswap-uikit'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import HeroCard from 'views/Home/components/HeroCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import BannerArcher from 'components/BannerArcher'
import { useTranslation } from 'contexts/Localization'
import 'react-multi-carousel/lib/styles.css'
import useTheme from '../../hooks/useTheme'

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  gap: 15px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > div {
      grid-column: span 4;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
      width: 100%;
    }
  }
`

const Background = styled.div`
  width: 100%;
`
const CopyRight = styled.div`
  text-align: center;
  .copy {
    ${({ theme }) => theme.mediaQueries.xs} {
      #A9A29D
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      color: #ED952E;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      color: #ED952E;
    }
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <Background>
      <BannerArcher
          src="/images/assets/banners/1token.png"
          mobileSrc="/images/assets/banners/1token_mobile.png"
          alt="home_banner"
          head={t('Welcome to')}
          head2={t('ArcherSwap')}
          title={t('Trade Mining, Farm & Pool')}
          text={t('Open for BOW')}
          isDark={isDark}
          white
        />
      <Page style={{minHeight: "auto"}}>
        <div>
          <Cards>
            <FarmStakingCard />
            <CakeStats />
            <TotalValueLockedCard />
          </Cards>
          <Hero>
            <HeroCard title="ArcherSwap" content="ArcherSwap is a crypto world for users to trade, earn, and game. It is the premier choice for projects on Core Chain with features including AMM, NFT, and GameFi."/>
          </Hero>
          <CopyRight>
            <Text className="copy">{`${t('©2023 ArcherSwap. All Rights Reserved')}`}</Text>
          </CopyRight>
        </div>
      </Page>
    </Background>
  )
}

export default Home
