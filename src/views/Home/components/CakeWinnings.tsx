import React, { useContext } from 'react'
import { useTotalClaim } from 'hooks/useTickets'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceBowUsd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
 }
`
const CakeWinnings = () => {
  const { lotteryType } = useContext(PastLotteryDataContext)
  const { claimAmount } = useTotalClaim(lotteryType)
  const bowAmount = getBalanceNumber(claimAmount)
  const claimAmountBusd = new BigNumber(bowAmount).multipliedBy(usePriceBowUsd()).toNumber()

  return (
    <Block>
      <CardValue value={bowAmount} lineHeight="1.5" />
      <CardBusdValue value={claimAmountBusd} decimals={2} />
    </Block>
  )
}

export default CakeWinnings
