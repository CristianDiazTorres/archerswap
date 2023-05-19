import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

import Tooltip from '../Tooltip/Tooltip'

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`

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

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultipler = multiplier ? multiplier.toLowerCase() : '-'
  const { t } = useTranslation()

  return (
    <Container>
      <MultiplierWrapper>{displayMultipler}</MultiplierWrapper>
      <Tooltip
        content={
          <div>
            {t('The multiplier represents the amount of BOW rewards each farm gets.')}
            <br />
            <br />
            {t('For example, if a 1x farm was getting 1 BOW per block, a 2x farm would be getting 2 BOW per block.')}
          </div>
        }
      >
        <HelpIcon color="textSubtle" />
      </Tooltip>
    </Container>
  )
}

export default Multiplier
