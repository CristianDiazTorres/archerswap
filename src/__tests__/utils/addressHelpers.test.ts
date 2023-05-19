import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    1116: '0x0487b824c8261462f88940f97053e65bdb498446',
    1115: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
  }

  it(`get address for mainnet (chainId 1116)`, () => {
    process.env.REACT_APP_CHAIN_ID = '1116'
    const expected = address[1116]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for testnet (chainId 1115)`, () => {
    process.env.REACT_APP_CHAIN_ID = '1115'
    const expected = address[1115]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for any other network (chainId 1115)`, () => {
    process.env.REACT_APP_CHAIN_ID = '1115'
    const expected = address[1116]
    expect(getAddress(address)).toEqual(expected)
  })
})
