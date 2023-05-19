import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

export interface AprProps {
  apr?: number
  farmApr?: number
  feeApr?: number
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apr: React.FC<AprProps> = ({ apr }) => {
  const { t } = useTranslation()
  return (
    <Container>
      {apr ? (
        <>
          <AprWrapper>{apr}%</AprWrapper>
        </>
      ) : (
        <AprWrapper>{t('Loading...')}</AprWrapper>
      )}
    </Container>
  )
}

export default Apr
