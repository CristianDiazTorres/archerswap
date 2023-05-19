import { usePriceBowUsd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from './useTickets'

const useLotteryTotalPrizesUsd = (lotteryType) => {
  const totalRewards = useTotalRewards(lotteryType)
  const totalCake = getBalanceNumber(totalRewards)
  const bowPriceUsd = usePriceBowUsd()

  return totalCake * bowPriceUsd.toNumber()
}

export default useLotteryTotalPrizesUsd
