import React from 'react'
import { Text } from 'archerswap-uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { usePriceBowUsd } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
  font-family: 'Doppio One';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 28px;
}
`
const BlockValue = styled.div`
  .block-text {
    font-family: 'Doppio One';
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    padding-top: 2px;
  }
`

const CakeHarvestBalance = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const allPending = useFarmsWithBalance()
  const earningsSum = allPending.reduce((accum, pending) => {
    return accum + new BigNumber(pending.balance).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const earningsBusd = new BigNumber(earningsSum).multipliedBy(usePriceBowUsd()).toNumber()

  if (!account) {
    return (
      <BlockValue>
        <Text fontSize="22px" color="#BABABA" className="block-text">
          {t('0.000')}
        </Text>
      </BlockValue>
    )
  }

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="1.5" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

export default CakeHarvestBalance
