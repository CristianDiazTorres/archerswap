import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Modal } from 'archerswap-uikit'
import { getFullDisplayBalance } from 'utils/formatBalance'
import TicketInput from 'components/TicketInput'
import ModalActions from 'components/ModalActions'
import { fetchDiscountData } from 'utils/fetchLotteryData'
import useBuyTickets from 'hooks/useBuyTickets'
import { useTranslation } from 'contexts/Localization'
import { LOTTERY_MAX_NUMBER_OF_TICKETS } from 'config'

interface BuyTicketModalProps {
  max: BigNumber
  lotteryId?: number
  lotterySize?: number
  lotteryType?: string
  maxRange?: number
  ticketPrice?: number
  onConfirm?: (amount: string, numbers: Array<number>) => void
  onDismiss?: () => void
  tokenName?: string
}

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({
  max,
  onDismiss,
  lotteryId,
  lotterySize,
  lotteryType,
  maxRange,
  ticketPrice,
}) => {
  const [val, setVal] = useState('0')
  const [pendingTx, setPendingTx] = useState(false)
  const { onBuyTickets } = useBuyTickets(lotteryId, lotterySize, maxRange, lotteryType)
  const [, setRequestedBuy] = useState(false)
  const [discountData, setDiscountData] = useState<any>({})
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const maxTickets = useMemo(() => {
    return parseInt(getFullDisplayBalance(max.div(ticketPrice)), 10)
  }, [max, ticketPrice])

  const getCostWithDiscount = useCallback(async () => {
    const res = await fetchDiscountData(lotteryType)
    setDiscountData(res)
  }, [lotteryType])

  useEffect(() => {
    getCostWithDiscount()
  }, [getCostWithDiscount])

  const cakeCosts = useCallback(
    (amount: string): number => {
      if (!discountData.bucketOneMax) return 0
      let percent = 0
      if (Number(amount) < Number(discountData.bucketOneMax)) {
        percent = discountData.discountForBucketOne
      } else if (Number(amount) >= Number(discountData.bucketTwoMax)) {
        percent = discountData.discountForBucketThree
      } else {
        percent = discountData.discountForBucketTwo
      }
      return (+amount * ticketPrice * (100 - percent)) / 100
    },
    [discountData, ticketPrice],
  )

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => setVal(e.currentTarget.value)

  const handleBuy = useCallback(async () => {
    try {
      setRequestedBuy(true)
      const txHash = await onBuyTickets(val, cakeCosts(val))
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedBuy(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onBuyTickets, setRequestedBuy, cakeCosts, val])

  const handleSelectMax = useCallback(() => {
    if (Number(maxTickets) > LOTTERY_MAX_NUMBER_OF_TICKETS) {
      setVal(LOTTERY_MAX_NUMBER_OF_TICKETS.toString())
    } else {
      setVal(maxTickets.toString())
    }
  }, [maxTickets])

  return (
    <Modal title={t('Enter amount of tickets to buy')} onDismiss={onDismiss}>
      <TicketInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={t('TICKET')}
        availableSymbol={lotteryType.toUpperCase()}
      />
      <Wrap>
        <div>
          <div>
            <Tips>
              {t(`1 Ticket = %lotteryPrice% %lotteryType%`, {
                lotteryPrice: ticketPrice,
                lotteryType: lotteryType.toUpperCase(),
              })}
            </Tips>
          </div>
          <div>
            <Announce>
              {t(`Ticket purchases are final. Your %lotteryType% cannot be returned to you after buying tickets.`, {
                lotteryType: lotteryType.toUpperCase(),
              })}
            </Announce>
          </div>
        </div>
        <div>
          <StyledMaxText>
            {t(`%num% %lotteryType% Available`, {
              num: fullBalance.toLocaleString(),
              lotteryType: lotteryType.toUpperCase(),
            })}
          </StyledMaxText>
        </div>
      </Wrap>
      <Final>
        <FinalContent>
          {t(`You will spend: %num% %lotteryType%`, { num: cakeCosts(val).toLocaleString(), lotteryType: lotteryType.toUpperCase(), })}
        </FinalContent>
      </Final>
      <ModalActions>
        <StyledButton width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </StyledButton>
        <Button
          id="lottery-buy-complete"
          width="100%"
          disabled={
            pendingTx ||
            parseInt(val) > Number(maxTickets) ||
            parseInt(val) > LOTTERY_MAX_NUMBER_OF_TICKETS ||
            parseInt(val) < 1
          }
          onClick={async () => {
            setPendingTx(true)
            await handleBuy()
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default BuyTicketModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`

const Final = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
`

const FinalContent = styled.div`
  padding: 15px 30px;
  border-radius: 6px;
  background: ${(props) => props.theme.colors.background};
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`

const Announce = styled.div`
  width: 100%;
  font-size: 14px;
  margin-top: 1em;
  margin-left: 0.4em;
  color: ${(props) => props.theme.colors.text};
`

const Wrap = styled.div`
  display: flex;
  margin-top: 10px;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.textDisabled};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  justify-content: flex-end;
`

const StyledButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.colors.text};
  color: ${(props) => props.theme.colors.text};
`
