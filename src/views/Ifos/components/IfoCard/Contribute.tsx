import React from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { Box, Button, Flex, Text, useModal } from 'archerswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useToast } from 'state/hooks'
import { UserInfo } from '../../hooks/useGetWalletIfoData'
import { PublicIfoState } from '../../hooks/useGetPublicIfoData'
import ContributeModal from './ContributeModal'
import PercentageOfTotal from './PercentageOfTotal'

interface ContributeProps {
  ifo: Ifo
  contract: Contract
  userInfo: UserInfo
  isPendingTx: boolean
  publicIfoData: PublicIfoState
  addUserContributedAmount: (amount: BigNumber) => void
}
const Contribute: React.FC<ContributeProps> = ({
  ifo,
  contract,
  userInfo,
  isPendingTx,
  publicIfoData,
  addUserContributedAmount,
}) => {
  const { currency, currencyAddress, currencyDecimals, maxDepositAmount } = ifo
  const { totalAmount } = publicIfoData
  const { t } = useTranslation()
  const contributedBalance = getBalanceNumber(userInfo.amount, currencyDecimals)
  const { toastSuccess } = useToast()

  const handleContributeSuccess = (amount: BigNumber) => {
    toastSuccess(
      t('Success!'),
      t(`You have contributed %num% %token% tokens to this IDO!`, {
        num: getBalanceNumber(amount, currencyDecimals),
        token: currency,
      }),
    )
    addUserContributedAmount(amount)
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      privateSale={ifo.isPrivate}
      currency={currency}
      contract={contract}
      currencyAddress={currencyAddress}
      currencyDecimals={currencyDecimals}
      contributedBalance={contributedBalance}
      maxDepositAmount={maxDepositAmount}
      onSuccess={handleContributeSuccess}
    />,
    false,
  )

  return (
    <Box>
      <Flex>
        <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
          {currency}
        </Text>
        <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
          {t('Committed')}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Box style={{ flex: 1 }} pr="8px">
          <Text bold fontSize="22px">
            {contributedBalance.toFixed(2)}
          </Text>
        </Box>
        <Button
          onClick={onPresentContributeModal}
          disabled={isPendingTx || (maxDepositAmount > 0 && contributedBalance >= maxDepositAmount)}
          style={{ height: '40px' }}
        >
          {t('Contribute')}
        </Button>
      </Flex>
      <PercentageOfTotal userAmount={userInfo.amount} totalAmount={totalAmount} />
    </Box>
  )
}

export default Contribute
