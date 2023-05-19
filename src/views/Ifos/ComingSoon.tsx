// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Button, Text } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import Title from './components/Title'

const Content = styled(Container)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr minmax(auto, 436px);
  }
`

const Block = styled.div`
  margin-bottom: 32px;
`

const MainImage = styled.img`
  display: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const MobileImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 136px;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

const LiquidityLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
`

const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Hero />
      <Content>
        <div>
          <Block>
            <Title as="h2">Coming Soon to ArcherSwap.</Title>
            <Text mb={3}>
              You’ll pay for the new tokens using BUSD tokens, which means you need to stake equal amounts of CAKE and
              BNB in a liquidity pool to take part.
            </Text>
            <Text mb={3}>
              <LiquidityLink href="https://archerswap.finance/#/add/BNB/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">
                Get BUSD
              </LiquidityLink>
            </Text>
            <Text mb={3}>
              The project gets the BNB, Archerswap burns the BOW.
              <br />
              <strong>You get the tokens.</strong>
            </Text>
          </Block>
          <MobileImage src="/images/ifo-bunny.svg" alt="ifo bunny" />
          <Block>
            <Title as="h2">Want to launch your own IFO?</Title>
            <Text mb={3}>
              Launch your project with ArcherSwap, Cronos's most-used AMM project and liquidity provider, to bring your
              token directly to the most active and rapidly growing community on Core Chain.
            </Text>
            <Button
              as="a"
              href="https://docs.google.com/forms/d/e/1FAIpQLScGdT5rrVMr4WOWr08pvcroSeuIOtEJf1sVdQGVdcAOqryigQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply to launch
            </Button>
          </Block>
        </div>
        <div>
          <MainImage src="/images/ifo-bunny.svg" alt="ifo bunny" />
        </div>
      </Content>
    </Page>
  )
}

export default ComingSoon
