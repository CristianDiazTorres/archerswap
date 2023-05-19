import React from 'react'
import styled from 'styled-components'
import { Text, Button, useModal } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import MyTicketsModal from '../TicketCard/UserTicketsModal'

const Wrapper = styled.div`
  display: flex;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledText = styled(Text)``

const Image = styled.img`
  margin-right: 6px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 20px;
  }
`
const StyledButton = styled(Button)`
  height: unset;
`

interface NoPrizesContentProps {
  tickets: Array<any>
}

const NoPrizesContent: React.FC<NoPrizesContentProps> = ({ tickets }) => {
  const { t } = useTranslation()
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)

  return (
    <Wrapper>
      <Image src="/images/assets/lotteryImage3.svg" alt="no prizes won" width={60} />
      <TextWrapper>
        <StyledText color="text">{t('Sorry, no prizes to collect')}</StyledText>
        <StyledButton variant="text" onClick={onPresentMyTickets}>
          {t('View your tickets')}
        </StyledButton>
      </TextWrapper>
    </Wrapper>
  )
}

export default NoPrizesContent
