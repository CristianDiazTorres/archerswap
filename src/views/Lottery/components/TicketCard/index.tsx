import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, Heading } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { useLotteryInfo } from 'hooks/useLotteryData'
import TicketActions from './TicketActions'

interface CardProps {
  isSecondCard?: boolean
  tickets?: Array<any>
}

const StyledCard = styled(Card)<CardProps>`
  ${(props) =>
    props.isSecondCard
      ? `  
        margin-top: 16px;

        ${props.theme.mediaQueries.sm} {
          margin-top: 8px;
        }

        ${props.theme.mediaQueries.lg} {
          margin-top: 8px;
        }
        `
      : ``}
`

const CardHeader = styled.div`
  align-items: center;
  display: flex;
`

const IconWrapper = styled.div`
  margin-right: 16px;
  svg {
    width: 48px;
    height: 48px;
  }
`

const TicketCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TicketCard: React.FC<CardProps> = ({ isSecondCard = false, tickets = [] }) => {
  const { t } = useTranslation()
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)
  const [lotteryStatus, setLotteryStatus] = useState(0)
  const lotteryInfo = useLotteryInfo(currentLotteryNumber, lotteryType)

  useEffect(() => {
    if (lotteryInfo) setLotteryStatus(lotteryInfo.lotteryStatus)
  }, [lotteryInfo])

  return (
    <StyledCard isSecondCard={isSecondCard}>
      <CardBody>
        <CardHeader>
          <IconWrapper>
            <img src="/images/assets/ticket.svg" alt="ticket" width="48" />
          </IconWrapper>
          {lotteryStatus === 0 ? (
            <TicketCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {t('On sale soon')}
              </Text>
            </TicketCountWrapper>
          ) : (
            <TicketCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {t('Your tickets for this round')}
              </Text>
              <Heading size="lg">{tickets ? tickets.length : 0}</Heading>
            </TicketCountWrapper>
          )}
        </CardHeader>
        <TicketActions tickets={tickets} />
      </CardBody>
    </StyledCard>
  )
}

export default TicketCard
