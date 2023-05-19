import React from 'react'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import { Route, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Banner from '../../components/Banner'
import HuntViewTabButtons from './components/HuntViewTabButtons'
import PriceAndSupply from './components/PriceAndSupply'
import Overview from './components/Overview'
import Dashboard from './components/Dashboard'

const HuntView: React.FC = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()

  return (
    <Background>
      <Banner
        src="/images/assets/banners/hunt_banner.png"
        mobileSrc="/images/assets/banners/mobile_hunt_banner.png"
        alt="pool_banner"
        title="Hunter"
        text={t('$HUNT is a next-generation Core reward token on the Core Chain ecosystem.')}
      />

      <Page>
        <Container>
          <HuntViewTabButtons />
          <PriceAndSupply />
        </Container>
        <Route exact path={`${path}`}>
          <Overview />
        </Route>
        <Route exact path={`${path}/dashboard`}>
          <Dashboard />
        </Route>
      </Page>
    </Background>
  )
}
const Background = styled.div`
  // width: 100%;
  // background-image: url('/images/assets/bg4.svg');
  // background-repeat: no-repeat;
  // background-position: top right;
`

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

    &:first-child {
      margin-right: 10px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

export default HuntView
