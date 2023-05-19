import React from 'react'
import { Card, CardBody, LinkExternal, Text } from 'archerswap-uikit'
import styled from 'styled-components'
import { Grid } from '@mui/material'
import { getHunterAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'

function HuntTokenDetails() {
  const { t } = useTranslation()

  return (
    <Container>
      <StyledCard>
        <StyledCardBody>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3} md={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Ticker')}
                </Text>
                <Text>HUNT</Text>
              </GridItem>
            </Grid>
            <Grid item xs={3} sm={3} md={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Max Supply')}
                </Text>
                <Text>1,000,000</Text>
              </GridItem>
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Contract Address')}
                </Text>
                <a href={`https://scan.coredao.org/token/${getHunterAddress()}`} rel="noreferrer" target="_blank">
                  <Text style={{ display: 'flex' }}>
                    {`${getHunterAddress().substring(0, 7)}...${getHunterAddress().substring(37)}`} <LinkExternal />
                  </Text>
                </a>
              </GridItem>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={6} md={3} lg={1.5}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400, maxWidth: 100 }}>
                  {t('Reflection to holder')}
                </Text>
                <Text>4%</Text>
              </GridItem>
            </Grid>
            <Grid item xs={6} md={3} lg={1.5}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400, maxWidth: 100 }}>
                  {t('Treasury')}
                </Text>
                <Text>0%</Text>
              </GridItem>
            </Grid>
            <Grid item xs={6} md={3} lg={1.5}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400, maxWidth: 100 }}>
                  {t('Increase Liquidity')}
                </Text>
                <Text>0%</Text>
              </GridItem>
            </Grid>
            <Grid item xs={6} md={3} lg={1.5}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400, maxWidth: 100 }}>
                  {t('Max amount per wallet')}
                </Text>
                <Text>2%</Text>
              </GridItem>
            </Grid>
            <Grid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400, maxWidth: 140 }}>
                  {t('One time max transaction amount')}
                </Text>
                <Text>0.49%</Text>
              </GridItem>
            </Grid>
            <Grid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400, maxWidth: 140 }}>
                  {t('Min token balance for dividend')}
                </Text>
                <Text>10</Text>
              </GridItem>
            </Grid>
          </Grid>
        </StyledCardBody>
      </StyledCard>
    </Container>
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
`
export const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => (theme?.isDark ? '#29292D' : '#E5E8EC')};
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
`

export default HuntTokenDetails
