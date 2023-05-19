import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

const HuntViewTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="primary">
        <ButtonMenuItem
          as={Link}
          to={`${url}`}
          style={{ borderRadius: '30px', width: '125px', height: 50, fontWeight: 500 }}
        >
          {t('Overview')}
        </ButtonMenuItem>
        <ButtonMenuItem
          as={Link}
          to={`${url}/dashboard`}
          style={{ borderRadius: '30px', width: '125px', height: 50, marginLeft: 0, fontWeight: 500 }}
        >
          {t('Dashboard')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default HuntViewTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  /* ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  } */
`
