import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

import Tooltip from '../Tooltip/Tooltip'

export interface TotalAprProps {
  apr: number
  farmApr: number
  feeApr: number
}

const Container = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    svg {
      margin-left: 0;
    }
  }
`

const AprWrapper = styled.div`
  min-width: 110px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.mediaQueries.xs} {
    text-align: center;
  }
`

const TotalApr: React.FunctionComponent<TotalAprProps> = ({ apr, farmApr, feeApr }) => {
  const { t } = useTranslation()

  return (
    <Container>
      <AprWrapper>{apr}%</AprWrapper>
      <Tooltip
        content={
          <>
            <span>{`${t('Farm APR')}:  ${farmApr}%`}</span>
            <br />
            <span>{`${t('Earned Trading Fee APR')}:  ${feeApr}%`}</span>
          </>
        }
      >
        <HelpIcon color="textSubtle" />
      </Tooltip>
    </Container>
  )
}

export default TotalApr
