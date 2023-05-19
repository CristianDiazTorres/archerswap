import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Modal, Box, Text } from 'archerswap-uikit'
import useTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import ApproveConfirmButtonsWithWhitelist from 'views/Profile/components/ApproveConfirmButtonsWithWhitelist'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useERC20 } from 'hooks/useContract'
import BalanceInput from './BalanceInput'

interface Props {
  privateSale: boolean
  currency: string
  contract: any
  currencyAddress: string
  currencyDecimals: number
  contributedBalance?: number
  maxDepositAmount?: number
  onSuccess: (amount: BigNumber) => void
  onDismiss?: () => void
}

const ContributeModal: React.FC<Props> = ({
  privateSale,
  currency,
  contract,
  currencyAddress,
  currencyDecimals,
  contributedBalance,
  maxDepositAmount,
  onDismiss,
  onSuccess,
}) => {
  const [value, setValue] = useState('')
  const { account } = useWeb3React()
  const raisingTokenContract = useERC20(currencyAddress)
  const balance = getBalanceNumber(useTokenBalance(currencyAddress), currencyDecimals)
  const { t } = useTranslation()
  const valueWithTokenDecimals = new BigNumber(value).times(new BigNumber(10).pow(currencyDecimals))
  const {
    isWhitelisted,
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onWhitelisted: async () => {
      try {
        const response = await contract.methods.isWhitelisted(account).call()
        return response
      } catch (error) {
        return false
      }
    },
    onRequiresApproval: async () => {
      try {
        const response = await raisingTokenContract.methods.allowance(account, contract.options.address).call()
        const currentAllowance = new BigNumber(response)
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return raisingTokenContract.methods
        .approve(contract.options.address, ethers.constants.MaxUint256)
        .send({ from: account })
    },
    onConfirm: () => {
      return contract.methods.deposit(valueWithTokenDecimals.toString()).send({ from: account })
    },
    onSuccess: async () => {
      onDismiss()
      onSuccess(valueWithTokenDecimals)
    },
  })

  const handleMax = () => {
    let temp = balance
    if (maxDepositAmount > 0 && maxDepositAmount - contributedBalance < temp) {
      temp = maxDepositAmount - contributedBalance
    }

    setValue(temp.toString())
  }

  return (
    <Modal title={t('Contribute %symbol%', { symbol: currency })} onDismiss={onDismiss}>
      <Box maxWidth="400px">
        <BalanceInput
          title={t('Contribute')}
          value={value}
          onChange={(e) => {
            if (parseFloat(e.currentTarget.value) >= 0 || !e.currentTarget.value) setValue(e.currentTarget.value)
          }}
          symbol={currency}
          max={balance}
          onSelectMax={() => handleMax()}
          mb="24px"
        />
        <Text as="p" mb="24px">
          {t(
            "If you don't contribute enough WCORE tokens, you may not receive any IDO tokens at all and will only receive a full refund of your WCORE tokens.",
          )}
        </Text>
        <ApproveConfirmButtonsWithWhitelist
          privateSale={privateSale}
          isWhitelisted={isWhitelisted}
          isApproveDisabled={isConfirmed || isConfirming || isApproved}
          isApproving={isApproving}
          isConfirmDisabled={
            !isApproved ||
            isConfirmed ||
            valueWithTokenDecimals.isNaN() ||
            valueWithTokenDecimals.eq(0) ||
            valueWithTokenDecimals.gt(new BigNumber(balance).times(new BigNumber(10).pow(currencyDecimals))) ||
            (maxDepositAmount > 0 &&
              valueWithTokenDecimals.gt(
                new BigNumber(maxDepositAmount - contributedBalance).times(new BigNumber(10).pow(currencyDecimals)),
              ))
          }
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
        />
        {/* <LinkExternal
          href={`https://archerswap.finance/#/add/CORE/${currencyAddress}`}
          style={{ margin: '16px auto 0' }}
        >
          {`Get ${currency}`}
        </LinkExternal> */}
      </Box>
    </Modal>
  )
}

export default ContributeModal
