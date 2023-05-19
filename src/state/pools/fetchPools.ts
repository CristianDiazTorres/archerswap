import poolsConfig from 'config/constants/pools'
import masterChefABI from 'config/abi/masterchef.json'
import sousChefABI from 'config/abi/sousChef.json'
import bowABI from 'config/abi/bow.json'
import wcoreABI from 'config/abi/wcore.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress, getWcoreAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => ![0, 8].includes(p.sousId))
  const callsStartTime = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startTime',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndTime',
    }
  })

  const starts = await multicall(sousChefABI, callsStartTime)
  const ends = await multicall(sousChefABI, callsEndBlock)
  return poolsWithEnd.map((bowPoolConfig, index) => {
    const startTime = starts[index]
    const endTime = ends[index]
    return {
      sousId: bowPoolConfig.sousId,
      startTime: new BigNumber(startTime).toJSON(),
      endTime: new BigNumber(endTime).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  const nonCorePools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'CORE')
  const corePool = poolsConfig.filter((p) => p.stakingToken.symbol === 'CORE')

  const callsNonCorePools = nonCorePools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsCorePools = corePool.map((poolConfig) => {
    return {
      address: getWcoreAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonBnbPoolsTotalStaked = await multicall(bowABI, callsNonCorePools)
  const bnbPoolsTotalStaked = await multicall(wcoreABI, callsCorePools)
  const poolsWithAllocPoint = await Promise.all(
    nonCorePools.map(async (pool) => {
      if (![0, 8].includes(pool.sousId)) {
        return pool
      }
      const [info, totalAllocPoint, tokenPerSecond] = await multicall(masterChefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [pool.sousId],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getMasterChefAddress(),
          name: 'cakePerSecond',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...pool,
        // tokenPerSecond: new BigNumber(tokenPerSecond).div(1e18).times(poolWeight).toJSON(),
        tokenPerSecond: new BigNumber(new BigNumber(tokenPerSecond).isZero() ? 200000000000000000 : tokenPerSecond)
          .div(1e18)
          .times(poolWeight)
          .toJSON(),
      }
    }),
  )

  return [
    ...poolsWithAllocPoint.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
      tokenPerSecond: p.tokenPerSecond,
    })),
    ...corePool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}
