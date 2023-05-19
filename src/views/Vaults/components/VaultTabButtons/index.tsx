import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

const VaultTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const textColor = isDark ? '' : '#2A2A2A'

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="primary">
        <ButtonMenuItem as={Link} to={`${url}`} style={{ borderRadius: '30px', width: '10px', color: textColor }}>
          {t('Live')}
        </ButtonMenuItem>
        <ButtonMenuItem
          as={Link}
          to={`${url}/history`}
          style={{ borderRadius: '30px', width: '100px', color: textColor }}
        >
          {t('Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default VaultTabButtons

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
