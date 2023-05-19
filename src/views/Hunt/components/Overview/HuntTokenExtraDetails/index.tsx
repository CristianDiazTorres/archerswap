import React from 'react'
import { Card, CardBody, Text } from 'archerswap-uikit'
import styled from 'styled-components'
import { Grid } from '@mui/material'
import { useTranslation } from 'contexts/Localization'

function HuntTokenExtraDetails() {
  const { t } = useTranslation()

  return (
    <Container>
      <StyledCard>
        <StyledCardBody>
          <Grid container spacing={2}>
            <StyledGrid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Public Sale')}
                </Text>
                <Text>30%</Text>
              </GridItem>
            </StyledGrid>
            <StyledGrid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Whitelist Sale')}
                </Text>
                <Text>20%</Text>
              </GridItem>
            </StyledGrid>
            <StyledGrid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Initial liquidity')}
                </Text>
                <Text>25%</Text>
              </GridItem>
            </StyledGrid>
            <StyledGrid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('BOW holders')}
                </Text>
                <Text>5%</Text>
              </GridItem>
            </StyledGrid>
            <StyledGrid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('DAO Fund')}
                </Text>
                <Text>10%</Text>
              </GridItem>
            </StyledGrid>
            <StyledGrid item xs={6} md={3} lg={2}>
              <GridItem>
                <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                  {t('Team')}
                </Text>
                <Text>10%</Text>
              </GridItem>
            </StyledGrid>
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
  position: relative;
`
export const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  padding: 0;
  /* gap: 20px; */
`

const StyledGrid = styled(Grid)`
  border: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    border: 0.5px solid ${({ theme }) => (theme?.isDark ? '#29292D' : '#E5E8EC')};
  }
`
const GridItem = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`

export default HuntTokenExtraDetails
