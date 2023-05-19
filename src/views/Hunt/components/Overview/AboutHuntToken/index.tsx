import React from 'react'
import { Button, Card, CardBody, Heading, Text } from 'archerswap-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

function AboutHuntToken() {
  const { t } = useTranslation()

  return (
    <Container>
      <StyledCard>
        <StyledCardBody>
          <CardContent>
            <div>
              <Heading as="h4" size="lg" mb="8px">
                {t('About $HUNT token')}
              </Heading>
              <Text as="p" color="textSubtle">
                {t('Overview of $HUNT token')}
              </Text>
            </div>
            <Text as="p" color="textSubtle">
              {t(
                "HUNT is a next-generation CORE reward token on the Core Chain ecosystem. 4% of every transaction made with the HUNT tokens, goes back to holders of HUNT in Core Chain rewards. With the recent boom in DeFi, our goal here at ArcherSwap is to make DeFi easy and accessible to everyone. DeFi doesn't have to be difficult, it can be as easy as buying and holding a token to earn passive income.",
              )}
            </Text>
            <Text as="p" color="textSubtle">
              <Text as="p" bold>
                {t('This is how HUNT works')}:
              </Text>
              {t(
                'Simply swap your coins for $HUNT on Core Chain, and HODL it! You could claim and track your rewards from our dashboard.',
              )}
            </Text>
            <a href="http://archerswap.finance/ido">
              <Button
                style={{
                  width: 'max-content',
                }}
              >
                {t('To buy $HUNT, click here')}
              </Button>
            </a>
          </CardContent>
          <StyledImage src="/images/assets/hunt/token-big.svg" alt="" />
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
  align-items: center;
  flex-direction: column-reverse;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`
export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 50%;
  }
`
export const StyledImage = styled.img`
  width: 100%;
  max-height: 250px;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 400px;
    width: 50%;
    flex-direction: row;
  }
`

export default AboutHuntToken
