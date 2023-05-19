import React, { useContext } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Heading, CardBody, CardFooter } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { getLotteryAddress } from 'utils/addressHelpers'
import LotteryCardHeading from '../LotteryCardHeading'
import PastLotteryActions from './PastLotteryActions'
import PrizeGrid from '../PrizeGrid'
import Timestamp from '../Timestamp'

interface PastRoundCardDetailsProps {
  data: any
}

const CardHeading = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: block;
  }
`

const TopLotteryCardHeading = styled(LotteryCardHeading)`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const PastRoundCardDetails: React.FC<PastRoundCardDetailsProps> = ({ data }) => {
  const { t } = useTranslation()
  const { lotteryType } = useContext(PastLotteryDataContext)

  const {
    lotteryID,
    prizePoolInBow,
    prizeDistribution,
    winningNumbers,
    winnerCounts,
    startingTimestamp,
    closingTimestamp,
  } = data

  return (
    !data.error &&
    data && 
    lotteryID > 0 && (
      <>
        <CardBody>
          <CardHeading>
            <div>
              <Heading size="md" mb="24px">
                {t(`Round #%num%`, { num: lotteryID })}
              </Heading>
              <Timestamp startTime={startingTimestamp} endTime={closingTimestamp} />
            </div>
            <TopLotteryCardHeading
              valueToDisplay={`${winningNumbers[0]}, ${winningNumbers[1]}, ${winningNumbers[2]}, ${winningNumbers[3]}`}
              Icon="/images/assets/win_ticket.svg"
            >
              {t('Winning Numbers')}
            </TopLotteryCardHeading>
            <LotteryCardHeading
              valueToDisplay={t(`${new BigNumber(prizePoolInBow).div(10 ** 18).toLocaleString()} ${lotteryType.toUpperCase()}`)}
              Icon={`/images/tokens/${lotteryType}.png`}
            >
              {t('Total Prizes')}
            </LotteryCardHeading>
          </CardHeading>
        </CardBody>
        <CardFooter>
          <PrizeGrid
            lotteryType={lotteryType}
            fourMatchesAmount={
              prizeDistribution[3] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[3])
                    .div(100)
                    .toNumber()
                : 0
            }
            threeMatchesAmount={
              prizeDistribution[2] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[2])
                    .div(100)
                    .toNumber()
                : 0
            }
            twoMatchesAmount={
              prizeDistribution[1] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[1])
                    .div(100)
                    .toNumber()
                : 0
            }
            burnAmount={
              prizeDistribution[0] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[0])
                    .div(100)
                    .toNumber()
                : 0
            }
            forwardAmount={
              prizeDistribution[0] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[0])
                    .div(100)
                    .toNumber()
                : 0
            }
            burnBowAmount={
              lotteryType === 'core' && prizeDistribution[4] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[4])
                    .div(100)
                    .toNumber()
                : 0
            }
            burnHuntAmount={
              lotteryType === 'core' && prizeDistribution[5] > 0
                ? new BigNumber(prizePoolInBow)
                    .div(10 ** 18)
                    .times(prizeDistribution[5])
                    .div(100)
                    .toNumber()
                : 0
            }
            jackpotMatches={winnerCounts[3]}
            threeTicketMatches={winnerCounts[2]}
            twoTicketMatches={winnerCounts[1]}
            pastDraw
          />
          <PastLotteryActions
            contractLink={`https://scan.coredao.org/address/${getLotteryAddress(lotteryType)}`}
            lotteryNumber={lotteryID}
          />
        </CardFooter>
      </>
    )
  )
}

export default PastRoundCardDetails
