import React from 'react'
import { Button, Card, CardBody, Text } from 'archerswap-uikit'
import styled from 'styled-components'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { useHunterData, useHunterCallback } from 'hooks/useHunterData'
import { useTracker } from 'hooks/useTracker'
import { getBalanceNumber } from 'utils/formatBalance'
import UnlockButton from 'components/UnlockButton'

function SatsCard() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { balance, claimableCore, claimedCore } = useHunterData()
  const { handleClaim, handleCompound, pending } = useHunterCallback()
  const { totalDividendsDistributed } = useTracker()
  const { account } = useWeb3React()

  return (
    <StyledCard>
      <StyledCardBody>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <GridItem>
              <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                {t('My HUNT Balance')}
              </Text>
              <StyledValue>
                <Text fontSize="large" bold>
                  {getBalanceNumber(balance).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}{' '}
                </Text>
                <Text fontSize="large" bold color="textSubtle">
                  HUNT
                </Text>
              </StyledValue>
            </GridItem>
          </Grid>
          <Grid item xs={6}>
            <GridItem>
              <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                {t('Claimable CORE')}
              </Text>
              <StyledValue>
                <Text fontSize="large" bold>
                  {getBalanceNumber(claimableCore).toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                </Text>
                <Text fontSize="large" bold color="textSubtle">
                  CORE
                </Text>
              </StyledValue>
            </GridItem>
          </Grid>
          <Grid item xs={6}>
            <GridItem>
              <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                {t('Total Dividends Distributed')}
              </Text>
              <StyledValue>
                <Text fontSize="large" bold>
                  {getBalanceNumber(totalDividendsDistributed).toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                </Text>
                <Text fontSize="large" bold color="textSubtle">
                  CORE
                </Text>
              </StyledValue>
            </GridItem>
          </Grid>
          <Grid item xs={6}>
            <GridItem>
              <Text small as="p" color="textSubtle" style={{ fontWeight: 400 }}>
                {t('Total claimed')}
              </Text>
              <StyledValue>
                <Text fontSize="large" bold>
                  {getBalanceNumber(claimedCore).toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                </Text>
                <Text fontSize="large" bold color="textSubtle">
                  CORE
                </Text>
              </StyledValue>
            </GridItem>
          </Grid>
        </Grid>
        <StyledButtonContainer>
          {account ? (
            <>
              <Button
                variant="secondary"
                style={{ border: isDark ? '1px solid #29292D' : '1px solid #E5E8EC' }}
                onClick={handleClaim}
                disabled={pending || claimableCore.lte(0)}
              >
                {t('Claim')}
              </Button>
              <Button onClick={handleCompound} disabled={pending || claimableCore.lte(0)}>
                {t('Compound')}
              </Button>
            </>
          ) : (
            <UnlockButton />
          )}
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

const StyledButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  button {
    width: 100%;
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

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledValue = styled.div`
  display: flex;
  gap: 5px;
`

export default SatsCard
