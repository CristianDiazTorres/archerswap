import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'BOW-WCORE LP',
    lpAddresses: {
      1115: '',
      1116: '0xBb8502132C87Ee31bE0E2bC1CB8CC69374488261',
    },
    token: tokens.bow,
    quoteToken: tokens.wcore,
  },
  {
    pid: 9,
    lpSymbol: 'BOW-USDT LP',
    lpAddresses: {
      1115: '',
      1116: '0x26601E75074B385594Ea5552F7B1EE5Ad7cF0403',
    },
    token: tokens.bow,
    quoteToken: tokens.usdt,
  },
  {
    pid: 3,
    lpSymbol: 'HUNT-CORE LP',
    lpAddresses: {
      1115: '',
      1116: '0x798489bacDDf8A3c5B1C23E7c24833B349F41dED',
    },
    token: tokens.wcore,
    quoteToken: tokens.hunt,
  },
  {
    pid: 4,
    lpSymbol: 'WCORE-USDT LP',
    lpAddresses: {
      1115: '',
      1116: '0xd24f5b6fA3064022A07c0D5dBE875a0e1AFB4354',
    },
    token: tokens.wcore,
    quoteToken: tokens.usdt,
  },
  {
    pid: 5,
    lpSymbol: 'WCORE-WETH LP',
    lpAddresses: {
      1115: '',
      1116: '0x48e0619aF7d6D58A3c01ABB33c94ceFc1d5809a2',
    },
    token: tokens.wcore,
    quoteToken: tokens.eth,
  },
  {
    pid: 6,
    lpSymbol: 'WETH-USDT LP',
    lpAddresses: {
      1115: '',
      1116: '0xf801c524bbC27DDB62190E1d8504640175ef5e18',
    },
    token: tokens.eth,
    quoteToken: tokens.usdt,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-USDC LP',
    lpAddresses: {
      1115: '',
      1116: '0x859F8fF7882Af9b6De0d15077b2725E25806c5f3',
    },
    token: tokens.usdt,
    quoteToken: tokens.usdc,
  },
  {
    pid: 10,
    lpSymbol: '4TOKEN-WCORE LP',
    lpAddresses: {
      1115: '',
      1116: '0x5Ab9f0Ea4fD182a1edC89D379c1F1c5d6B6eF623',
    },
    token: tokens.fourToken,
    quoteToken: tokens.wcore,
  },
]

export default farms
