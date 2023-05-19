import BigNumber from 'bignumber.js'
import { SECONDS_PER_YEAR, BOW_PER_BLOCK, VAULTS_DISTRIBUTION_PERCENTAGE } from 'config'

/**
 * Get the APY value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerSecond Amount of new bow allocated to the pool for each new block
 * @returns Null if the APY is NaN or infinite.
 */
export const getPoolApy = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerSecond: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerSecond).times(SECONDS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}

/**
 * Get farm APY value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param bowPriceUSD BOW price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApy = (
  poolWeight: BigNumber,
  bowPriceUSD: BigNumber,
  poolLiquidityUsd: BigNumber,
  tokenPerSecond: BigNumber,
): number => {
  const yearlyCakeRewardAllocation = tokenPerSecond.times(SECONDS_PER_YEAR).times(poolWeight)
  const apy = yearlyCakeRewardAllocation.times(bowPriceUSD).div(poolLiquidityUsd).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}
export const compound = (r, p = 1, n = 365, t = 1) => (1 + (p * r) / (n * t)) ** (n * t) - 1

/**
 * Get vault APY value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getVaultApy = (
  poolWeight: BigNumber,
  rewardPriceUSD: BigNumber,
  poolLiquidityUsd: BigNumber,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider?: string,
): number => {
  const yearlyBowRewardAllocation = BOW_PER_BLOCK.times(SECONDS_PER_YEAR).times(poolWeight)
  const _apy = yearlyBowRewardAllocation.times(rewardPriceUSD).div(poolLiquidityUsd).toString(10)
  const apy = new BigNumber(compound(_apy, VAULTS_DISTRIBUTION_PERCENTAGE, 365, 1)).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}

export default null
