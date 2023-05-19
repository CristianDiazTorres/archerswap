import React from 'react'
// import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Heading, Card, Flex } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

const Icon = styled.img`
  margin: 27px 0 16px 0;
  height: 125px;
`
const StyledCard = styled(Card)<any>`
  background: ${({ theme, isDark }) => (isDark ? theme.card.background : '#fff')};
  box-shadow: ${({ theme, isDark }) =>
    isDark ? '0px 3.5px 10px rgba(134, 145, 172, 0.1)' : '0px 3.5px 10px rgba(10, 14, 22, 0.1)'};
  border-radius: 16px;
  border: ${({ theme, isDark }) => (isDark ? '1px solid #29292D' : '0px solid')};
  text-align: center;

  :hover {
    transform: scale(1.01);
  }
`

const BowCard = ({ iconSrc, iconAlt, heading, link }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <StyledCard isDark={isDark}>
      <a href={link} target="_blank" rel="noreferrer">
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between">
          <Icon src={iconSrc} alt={iconAlt} />
          <Heading as="h2" size="md" mb="30px" color="primaryDark">
            {t(`${heading}`)}
          </Heading>
        </Flex>
      </a>
    </StyledCard>
  )
}

export default BowCard
