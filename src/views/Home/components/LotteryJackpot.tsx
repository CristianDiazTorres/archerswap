import React, { useContext } from 'react'
import { Text } from 'archerswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'
import { useTranslation } from 'contexts/Localization'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { usePriceBowUsd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardBusdValue from './CardBusdValue'

const LotteryJackpot = () => {
  const { t } = useTranslation()
  const { lotteryType } = useContext(PastLotteryDataContext)
  const lotteryPrizeAmount = useTotalRewards(lotteryType)
  const balance = getBalanceNumber(lotteryPrizeAmount)
  const lotteryPrizeAmoutCake = balance.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
  const lotteryPrizeAmountBusd = new BigNumber(balance).multipliedBy(usePriceBowUsd()).toNumber()

  return (
    <>
      <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
        {lotteryPrizeAmoutCake} {t('CAKE')}
      </Text>
      <CardBusdValue value={lotteryPrizeAmountBusd} />
    </>
  )
}

export default LotteryJackpot
