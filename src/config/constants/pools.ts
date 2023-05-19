import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.xbow,
    earningToken: tokens.bow,
    contractAddress: {
      1115: '',
      1116: '0xdbf74f167a4e0b97a072c7ed51df6c6e8ec0353b',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerSecond: '0',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 1,
    stakingToken: tokens.xbow,
    earningToken: tokens.hunt,
    contractAddress: {
      1115: '',
      1116: '0xCDbfc330f64b122205F29e9394233cD1ebffbCa0',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerSecond: '0.002893',
    sortOrder: 1,
    isFinished: false,
    depositFee: 0,
  },
  {
    sousId: 2,
    stakingToken: tokens.xbow,
    earningToken: tokens.wcore,
    contractAddress: {
      1115: '',
      1116: '0x87bB2fE70b7129AA168FF7e6679e424eEF4261F0',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerSecond: '0.000964506',
    sortOrder: 2,
    isFinished: false,
    depositFee: 0,
  },
  {
    sousId: 8,
    stakingToken: tokens.hunt,
    earningToken: tokens.bow,
    contractAddress: {
      1115: '',
      1116: '0xdbf74f167a4e0b97a072c7ed51df6c6e8ec0353b',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerSecond: '0',
    sortOrder: 3,
    isFinished: false,
  },
  {
    sousId: 3,
    stakingToken: tokens.xbow,
    earningToken: tokens.fourToken,
    contractAddress: {
      1115: '',
      1116: '0x05fB00a7F695473E166616C3c3Fc472dda95f2DA',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerSecond: '51.440329',
    sortOrder: 4,
    isFinished: false,
    depositFee: 0,
  },
]

export default pools
