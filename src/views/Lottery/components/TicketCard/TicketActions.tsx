import React, { useContext, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import styled from 'styled-components'
import { Button, useModal } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { useLotteryInfo, useLotteryMetaData } from 'hooks/useLotteryData'
import { useLotteryAllowance } from 'hooks/useAllowance'
import useTokenBalance, { useETHBalance } from 'hooks/useTokenBalance'
import { getBowAddress } from 'utils/addressHelpers'
import { useApproval } from 'hooks/useApproval'
import BuyTicketModal from './BuyTicketModal'
import MyTicketsModal from './UserTicketsModal'
import PurchaseWarningModal from './PurchaseWarningModal'

const CardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`
interface TicketCardProps {
  tickets?: Array<any>
}

const TicketCard: React.FC<TicketCardProps> = ({ tickets = [] }) => {
  const { t } = useTranslation()
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)
  const allowance = useLotteryAllowance(lotteryType)
  const [lotteryStatus, setLotteryStatus] = useState(0)
  const [confirm, setConfirm] = useState(false)
  const lotteryInfo = useLotteryInfo(currentLotteryNumber, lotteryType)
  const lotteryMetaData = useLotteryMetaData(currentLotteryNumber, lotteryType)

  const onConfirm = () => {
    setConfirm(true)
  }

  useEffect(() => {
    if (lotteryInfo) setLotteryStatus(lotteryInfo.lotteryStatus)
  }, [lotteryInfo])

  const bowBalance = useTokenBalance(getBowAddress())
  const coreBalance = useETHBalance()
  const ticketsLength = tickets ? tickets.length : 0
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" lotteryType={lotteryType}/>)
  const [onPresentApprove] = useModal(<PurchaseWarningModal onConfirm={onConfirm} />)
  const [onPresentBuy] = useModal(
    <BuyTicketModal
      max={lotteryType === 'bow' ? bowBalance : coreBalance}
      tokenName="BOW"
      lotteryId={currentLotteryNumber}
      lotteryType={lotteryType}
      lotterySize={lotteryMetaData ? lotteryMetaData.lotterySize : 4}
      maxRange={lotteryMetaData ? lotteryMetaData.lotteryMaxRange : 10}
      ticketPrice={lotteryInfo ? new BigNumber(lotteryInfo.costPerTicket).div(10 ** 18).toNumber() : 1}
    />,
  )
  const { handleApprove, requestedApproval } = useApproval(null, lotteryType)

  const approveHandler = () => {
    onPresentApprove()
  }

  useEffect(() => {
    if (confirm) {
      setConfirm(false)
      handleApprove()
    }
  }, [confirm, handleApprove])

  const renderLotteryTicketButtons = (buyPossible) => {
    if (lotteryType === 'bow' && !allowance.toNumber()) {
      return (
        <>
          <Button style={{ marginRight: '20px' }} width="100%" disabled>
            {t('View your tickets')}
          </Button>
          <Button width="100%" disabled={requestedApproval || !buyPossible} onClick={approveHandler}>
            {t('Approve BOW')}
          </Button>
        </>
      )
    }
    return (
      <>
        <Button
          style={{ marginRight: '20px' }}
          width="100%"
          disabled={ticketsLength === 0}
          variant="secondary"
          onClick={onPresentMyTickets}
        >
          {t('View your tickets')}
        </Button>
        <Button id="lottery-buy-start" width="100%" disabled={!buyPossible} onClick={onPresentBuy}>
          {t('Buy ticket')}
        </Button>
      </>
    )
  }

  return (
    <CardActions>
      {!lotteryInfo ||
      (lotteryStatus === 0 && lotteryInfo.startingTimestamp > 0 && lotteryInfo.startingTimestamp > moment().unix()) ||
      lotteryStatus === 4 ? (
        // <Button disabled> {t('On sale soon')}</Button>
        <></>
      ) : (
        renderLotteryTicketButtons(lotteryInfo.closingTimestamp > 0 && lotteryInfo.closingTimestamp > moment().unix())
      )}
    </CardActions>
  )
}

export default TicketCard
