import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import Container from 'components/layout/Container'
import { useTranslation } from 'contexts/Localization'
import IfoTabButtons from './components/IfoTabButtons'
// import Hero from './components/Hero'
import Banner from '../../components/Banner'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Background = styled.div`
  width: 100%;
`

const StyledContainer = styled(Container)`
  max-width: 1034px;
`

const Ifos = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()

  return (
    <Background>
      <Banner
        src="/images/assets/banners/ifo_banner.png"
        mobileSrc="/images/assets/banners/mobile_ifo_banner.png"
        alt="IDO_banner"
        title="BowPad"
        text={t('Buy new tokens with a brand new token sale model.')}
      />
      <StyledContainer>
        <IfoTabButtons />
        <Route exact path={`${path}`}>
          <CurrentIfo />
        </Route>
        <Route path={`${path}/history`}>
          <PastIfo />
        </Route>
      </StyledContainer>
    </Background>
  )
}

export default Ifos
