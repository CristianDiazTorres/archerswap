import React, { useCallback, useState, useContext } from 'react'
import styled from 'styled-components'
import { Button, Heading, useModal } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import useClaimReward from 'hooks/useClaimReward'
import Loading from '../Loading'
import MyTicketsModal from '../TicketCard/UserTicketsModal'

const WinningsWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

const IconWrapper = styled.div`
  text-align: center;
  svg {
    width: 80px;
    height: 80px;
  }
`

const StyledCardActions = styled.div`
  margin-top: ${(props) => props.theme.spacing[3]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[1]}px;
`
interface PrizesWonContentProps {
  winnings?: string
  tickets?: Array<any>
  rewardTicketIds?: Array<any>
}

const PrizesWonContent: React.FC<PrizesWonContentProps> = ({ winnings, tickets, rewardTicketIds }) => {
  const [requestedClaim, setRequestedClaim] = useState(false)
  const { t } = useTranslation()
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)
  const [onPresentMyTickets] = useModal(
    <MyTicketsModal myTicketNumbers={tickets} from="buy" lotteryType={lotteryType} />,
  )
  const { onClaimReward } = useClaimReward(currentLotteryNumber, lotteryType)

  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onClaimReward(rewardTicketIds)
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedClaim(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedClaim(false)
    }
  }, [onClaimReward, setRequestedClaim, rewardTicketIds])

  return (
    <StyledCardContentInner>
      <div>
        <Heading as="h3" size="lg" color="secondary">
          {t('You won!')}
        </Heading>
        {requestedClaim && <Loading />}
        {!requestedClaim && (
          <>
            <WinningsWrapper>
              <Heading as="h4" size="xl" style={{ marginRight: '6px' }}>
                {winnings}
              </Heading>
              <Heading as="h4" size="lg">
                {lotteryType.toUpperCase()}
              </Heading>
            </WinningsWrapper>
          </>
        )}
        <StyledCardActions>
          <Button width="100%" disabled={requestedClaim || rewardTicketIds.length === 0} onClick={handleClaim}>
            {t('Collect')}
          </Button>
        </StyledCardActions>
      </div>
      <div>
        <IconWrapper>
          <img src="/images/assets/ticket.svg" alt="win" width={100} />
        </IconWrapper>
        <StyledButton variant="text" onClick={onPresentMyTickets}>
          {t('View your tickets')}
        </StyledButton>
      </div>
    </StyledCardContentInner>
  )
}

export default PrizesWonContent
