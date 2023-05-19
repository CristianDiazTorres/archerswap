import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, Heading } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

const StyledHeroCard = styled(Card)<any>`
  background: ${({ theme, isDark }) => (isDark ? theme.card.background : '#fff')};
  box-shadow: ${({ theme, isDark }) =>
    isDark ? '0px 3.5px 10px rgba(134, 145, 172, 0.1)' : '0px 3.5px 10px rgba(10, 14, 22, 0.1)'};
  border-radius: 0px;
  border: ${({ theme, isDark }) => (isDark ? '1px solid #29292D' : '0px solid')};
  width: 100%;
  .card {
    & > div {
      width: 65%;
    }
  
    ${({ theme }) => theme.mediaQueries.sm} {
      & > div {
        width: 100%;
      }
    }
  
    ${({ theme }) => theme.mediaQueries.xs} {
      & > div {
        width: 100%;
      }
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      & > div {
        width: 65%;
      }
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      & > div {
        width: 65%;
      }
    }  
  }
`

const BowTitle = styled(Heading)`
  font-size: 24px;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
`
const BackgroundArcherSwap = styled.img`
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`
const ContentTxt = styled.div`
  .content {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
`

const HeroCard = ({title, content}) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <StyledHeroCard isDark={isDark}>
      <CardBody className="card">
        <BowTitle as="h1" mb="12px" color="#BA6401" textAlign="left">
          {t(`${title}`)}
        </BowTitle>
        <ContentTxt>
          <Text color="#A9A29D" fontSize="18px" className="content">
            {t(`${content}`)}
          </Text>
        </ContentTxt>
      </CardBody>
      {isDark ? (
        <BackgroundArcherSwap src='images/bg_archerswap.png' className='archer' />
      ) : (
        <BackgroundArcherSwap src='images/bg_archerswap_light.png' className='archer' />
      )}
    </StyledHeroCard>
  )
}

export default HeroCard
