import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'archerswap-uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 39px;
  ${({ theme }) => theme.mediaQueries.xs} {
    margin-top: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`

const IfoTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const { isDark } = useTheme()
  const textColor = isDark ? '' : '#2A2A2A'
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={!isExact ? 1 : 0} scale="sm" variant="primary">
        <ButtonMenuItem as={Link} to={`${url}`} style={{ borderRadius: '30px', color: 'contrast' }}>
          {t('Next IDO')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`} style={{ borderRadius: '30px', color: 'contrast' }}>
          {t('Past IDOs')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default IfoTabButtons
