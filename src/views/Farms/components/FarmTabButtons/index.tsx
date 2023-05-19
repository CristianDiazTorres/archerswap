import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

const FarmTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="primary">
        <ButtonMenuItem as={Link} to={`${url}`} style={{ borderRadius: '30px', width: '125px', fontWeight: 500 }}>
          {t('Live')}
        </ButtonMenuItem>
        <ButtonMenuItem
          as={Link}
          to={`${url}/history`}
          style={{ borderRadius: '30px', width: '125px', marginLeft: 0, fontWeight: 500 }}
        >
          {t('Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
