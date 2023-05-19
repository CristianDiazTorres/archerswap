import { Currency, ETHER } from 'archerswap-sdk'
import React from 'react'
import styled from 'styled-components'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import CoinLogo from '../archer/CoinLogo'

export const getTokenLogoURLForMetamask = (symbol: string) => {
  return `https://archerswap.finance/images/coins/${symbol}.png`
}

const StyledCoreLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const srcs: string[] = [currency instanceof WrappedTokenInfo ? currency.tokenInfo.logoURI : undefined]
  if (currency === ETHER) {
    return <StyledCoreLogo src="/images/coins/core.png" size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
