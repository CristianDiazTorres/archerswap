import React from 'react'
import styled from 'styled-components'
import { Card, CardBody } from 'archerswap-uikit'
import PrizesWonContent from './PrizesWonContent'
import NoPrizesContent from './NoPrizesContent'

const StyledCard = styled(Card)`
  ${(props) =>
    props.isDisabled
      ? `  
        margin-top: 16px;
        background-color: unset;
        box-shadow: unset;
        border: 1px solid ${props.theme.colors.textDisabled};

        ${props.theme.mediaQueries.sm} {
          margin-top: 24px;
        }

        ${props.theme.mediaQueries.lg} {
          margin-top: 32px;
        }
        `
      : ``}
`

interface YourPrizesCardProps {
  isAWin?: boolean
  tickets?: Array<any>
  rewardTicketIds?: Array<any>
  winnings?: string
}

const YourPrizesCard: React.FC<YourPrizesCardProps> = ({
  isAWin = false,
  tickets = [],
  rewardTicketIds = [],
  winnings = '0.00',
}) => {
  return (
    <StyledCard isDisabled={!isAWin} isActive={false}>
      <CardBody>
        {isAWin ? (
          <PrizesWonContent tickets={tickets} rewardTicketIds={rewardTicketIds} winnings={winnings} />
        ) : (
          <NoPrizesContent tickets={tickets} />
        )}
      </CardBody>
    </StyledCard>
  )
}

export default YourPrizesCard
