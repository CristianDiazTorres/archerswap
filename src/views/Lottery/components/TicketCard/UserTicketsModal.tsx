import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from 'archerswap-uikit'
import styled from 'styled-components'
import { useLotteryCurrentRoundNo, useLotteryInfo } from 'hooks/useLotteryData'
import { useTranslation } from 'contexts/Localization'

interface UserTicketsModalProps {
  myTicketNumbers: Array<any>
  lotteryNo?: number
  lotteryType?: string
  from?: string
  onDismiss?: () => void
}

const UserTicketsModal: React.FC<UserTicketsModalProps> = ({ myTicketNumbers, lotteryNo = 0, lotteryType, onDismiss }) => {
  const currentLotteryNumber = useLotteryCurrentRoundNo(lotteryType)
  const [winNumbers, setWinNumbers] = useState([0, 0, 0, 0])
  const [lotteryStatus, setLotteryStatus] = useState(0)
  const [listItems, setListItems] = useState<any>(<></>)
  const lotteryInfo = useLotteryInfo(lotteryNo > 0 ? lotteryNo : currentLotteryNumber, lotteryType)

  useEffect(() => {
    if (lotteryInfo) {
      setLotteryStatus(lotteryInfo.lotteryStatus)
      if (lotteryInfo.lotteryStatus === 4) {
        setWinNumbers(lotteryInfo.winningNumbers)
      } else {
        setWinNumbers([0, 0, 0, 0])
      }
    }
  }, [lotteryInfo, lotteryType])

  const { t } = useTranslation()

  const rewardMatch = useCallback(
    (number) => {
      let n = 0
      for (let i = winNumbers.length - 1; i >= 0; i--) {
        // eslint-disable-next-line eqeqeq
        if (winNumbers[i] == number[i]) n++
      }
      return n
    },
    [winNumbers],
  )

  useEffect(() => {
    const tempListItems = myTicketNumbers ? (
      myTicketNumbers.map(({ ticketNumbers }, index) => {
        if (lotteryStatus === 4 && rewardMatch(ticketNumbers[0]) > 1) {
          const emoji = new Array(rewardMatch(ticketNumbers[0]) + 1).join('🤑')
          return (
            // eslint-disable-next-line react/no-array-index-key
            <RewardP key={index}>
              {emoji}
              {ticketNumbers.toString()}
              {emoji}
            </RewardP>
          )
        }
        // eslint-disable-next-line react/no-array-index-key
        return <p key={index}>{ticketNumbers.toString()}</p>
      })
    ) : (
      <></>
    )
    setListItems(tempListItems)
  }, [lotteryStatus, myTicketNumbers, rewardMatch])

  return (
    <Modal
      title={t(`My Tickets (Total: %TICKETS%)`, { TICKETS: myTicketNumbers ? myTicketNumbers.length : 0 })}
      onDismiss={onDismiss}
    >
      <TicketsList>
        <h2>{listItems}</h2>
      </TicketsList>
      <StyledButton variant="secondary" onClick={onDismiss}>
        {t('Close')}
      </StyledButton>
    </Modal>
  )
}

const RewardP = styled.div`
  color: #ff8c28;
`

const TicketsList = styled.div`
  text-align: center;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]}px;
`

export default UserTicketsModal
