import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { useVaultHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import { getAddress } from 'utils/addressHelpers'
import Tooltip from '../Tooltip/Tooltip'

interface VaultCardActionsProps {
  earnings?: BigNumber
  pid?: number
  strategyAddresses?: any
}

const HarvestAction: React.FC<VaultCardActionsProps> = ({ earnings, ...props }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useVaultHarvest(getAddress(props.strategyAddresses))

  const rawEarningsBalance = account ? getBalanceNumber(earnings) : 0
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      <Tooltip
        content={t(
          'Users who call the compound button will call the contract for everyone in the vault contract. You will receive 0.5% of the entire compound as a wcore reward to compensate for your gas costs',
        )}
      >
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {t('Compound')}
        </Button>
      </Tooltip>
    </Flex>
  )
}

export default HarvestAction
