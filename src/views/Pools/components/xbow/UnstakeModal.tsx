import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Text } from 'archerswap-uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface UnstakeModalProps {
  max: BigNumber
  onConfirm?: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  deadline?: number
}

const UnstakeModal: React.FC<UnstakeModalProps> = ({ onConfirm, onDismiss, max, deadline }) => {
  const currentTimestamp = Math.floor(new Date().getTime() / 1000)
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={t('Unstake BOW')} onDismiss={onDismiss}>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol="xBOW"
        inputTitle={t('Unstake')}
        isXBOW
      />
      {deadline > currentTimestamp && (
        <Text fontSize="14px" style={{ margin: 'auto', marginTop: '24px' }}>
          {t('Free withdrawal eligible in:')}{' '}
          {deadline > 86400
            ? `${Math.floor((deadline - currentTimestamp) / 86400)} days`
            : `${Math.floor((deadline - currentTimestamp) / 3600)} hours`}
        </Text>
      )}
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%">
          {t('Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !val || val === '0' || Number(fullBalance) < Number(val)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
          width="100%"
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default UnstakeModal
