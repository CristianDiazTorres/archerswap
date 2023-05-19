import React from 'react'
import styled from 'styled-components'
// import ApyButton from 'views/Vaults/components/VaultCard/ApyButton'
import { Address } from 'config/constants/types'
import BigNumber from 'bignumber.js'
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { useTranslation } from 'contexts/Localization'

export interface AprProps {
  value: string
  // multiplier: string
  lpLabel: string
  quoteTokenAdresses: Address
  quoteTokenSymbol: string
  tokenAddresses: Address
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
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
  word-break: break-all;
`

const Apr: React.FC<AprProps> = ({
  value,
  // lpLabel,
  // quoteTokenAdresses,
  // tokenAddresses,
  // cakePrice,
  originalValue,
  // hideButton = false,
  // ...props
}) => {
  const { t } = useTranslation()
  // const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, tokenAddresses })
  // const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  return (
    <Container>
      {originalValue ? (
        <>
          <AprWrapper>{value}%</AprWrapper>
          {/* {!hideButton && (
            <ApyButton lpLabel={lpLabel} cakePrice={cakePrice} apy={originalValue} addLiquidityUrl={addLiquidityUrl} />
          )} */}
        </>
      ) : (
        <AprWrapper>{t('Loading...')}</AprWrapper>
      )}
    </Container>
  )
}

export default Apr
