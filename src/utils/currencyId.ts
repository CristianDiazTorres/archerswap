import { Currency, ETHER, Token } from 'archerswap-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'CORE'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
