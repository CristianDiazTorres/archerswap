import React, { useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'archerswap-uikit'
import BigNumber from 'bignumber.js'
import { VaultWithStakedValue } from 'views/Vaults/components/VaultCard/VaultCard'
import { getBalanceNumber } from 'utils/formatBalance'
import { useVaultHarvest } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
import { useGetApiPrices } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { useCountUp } from 'react-countup'
import Tooltip from '../../Tooltip/Tooltip'

import { ActionContainer, ActionTitles, Title, ActionContent, Earned, Staked } from './styles'

const HarvestAction: React.FunctionComponent<VaultWithStakedValue> = ({ userData, ...props }) => {
  const { account } = useWeb3React()
  const prices = useGetApiPrices()
  const earningsBigNumber = userData && account ? new BigNumber(userData.earnings) : null
  let earnings = null
  let earningsBusd = 0
  let displayBalance = '?'

  if (earningsBigNumber) {
    const quoteTokenPriceUsd = prices[props.quoteToken.symbol.toLowerCase()]
    const totalLiquidity = new BigNumber(props.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
    const lpPrice = new BigNumber(totalLiquidity).div(props.vaultBalance)
    earnings = getBalanceNumber(earningsBigNumber)
    earningsBusd = new BigNumber(earnings).multipliedBy(props.isSingle ? quoteTokenPriceUsd : lpPrice).toNumber()
    displayBalance = earnings.toLocaleString()
  }

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useVaultHarvest(getAddress(props.strategyAddresses))
  const { t } = useTranslation()

  const { countUp, update } = useCountUp({
    start: 0,
    end: earningsBusd,
    duration: 1,
    separator: ',',
    decimals: 3,
  })
  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(earningsBusd)
  }, [earningsBusd, updateValue])

  return (
    <ActionContainer>
      <ActionTitles>
        <Title>{t('Deposited + Earned')}</Title>
      </ActionTitles>
      <ActionContent>
        <div>
          <Earned>{displayBalance}</Earned>
          <Staked>~{countUp} USD</Staked>
        </div>
        <Tooltip
          content={t(
            'Users who call the compound button will call the contract for everyone in the vault contract. You will receive 0.5% of the entire compound as a wcore reward to compensate for your gas costs',
          )}
        >
          <Button
            disabled={pendingTx || !account}
            onClick={async () => {
              setPendingTx(true)
              await onReward()
              setPendingTx(false)
            }}
            ml="4px"
          >
            {t('Compound')}
          </Button>
        </Tooltip>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
