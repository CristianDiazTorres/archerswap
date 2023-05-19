import React from 'react'
import BigNumber from 'bignumber.js'
import { Text } from 'archerswap-uikit'
import { UserInfo } from 'views/Ifos/hooks/useGetWalletIfoData'
import { useTranslation } from 'contexts/Localization'

interface PercentageOfTotalProps {
  userAmount: UserInfo['amount']
  totalAmount: BigNumber
}

const PercentageOfTotal: React.FC<PercentageOfTotalProps> = ({ userAmount, totalAmount }) => {
  const { t } = useTranslation()
  const percentOfUserContribution = totalAmount.gt(0) ? userAmount.div(totalAmount).times(100).toNumber() : 0
  const percentofUserDisplay = percentOfUserContribution.toLocaleString(undefined, { maximumFractionDigits: 2 })

  return (
    <Text fontSize="14px" color="textSubtle">
      {t('%num% of total', { num: percentofUserDisplay })}
    </Text>
  )
}

export default PercentageOfTotal
