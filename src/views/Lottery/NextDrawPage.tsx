import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Button, BaseLayout } from 'archerswap-uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { fetchLotteryTicketData } from 'utils/fetchLotteryData'
import useRefresh from 'hooks/useRefresh'
import { useLotteryTotalPrizeData } from 'hooks/useLotteryData'
import { claimReward } from 'utils/callHelpers'
import { useLottery } from 'hooks/useContract'
import useGasBoost from 'hooks/useGasBoost'
import { useTranslation } from 'contexts/Localization'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import YourPrizesCard from './components/YourPrizesCard'
import UnlockWalletCard from './components/UnlockWalletCard'
import TicketCard from './components/TicketCard'
import TotalPrizesCard from './components/TotalPrizesCard'
import WinningNumbers from './components/WinningNumbers'
import HowItWorks2 from './components/HowItWorks2'
import HowItWorks from './components/HowItWorks'

const Cards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const SecondCardColumnWrapper = styled.div<{ isAWin?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isAWin ? 'column' : 'column-reverse')};
`

const ClaimDiv = styled.div`
  text-align: center;
  margin: 20px auto;
`

const NextDrawPage: React.FC = () => {
  const { account } = useWeb3React()
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)
  const lotteryContract = useLottery(lotteryType)
  const { t } = useTranslation()  
  const [requestedClaim, setRequestedClaim] = useState(false)
  const { fastRefresh } = useRefresh()
  const [rewardSum, setRewardSum] = useState(new BigNumber(0))
  const [rewardTicketIds, setRewardTicketIds] = useState([])
  const [lotteryTicketData, setLotteryTicketData] = useState(null)
  const isAWin = rewardSum.gt(0)
  const lotteryTotalPrizeData = useLotteryTotalPrizeData(currentLotteryNumber, lotteryType)
  const { gasBoostedPrice } = useGasBoost()

  useEffect(() => {
    const fetchRecentLotteryData = async () => {
      try {
        const data = await fetchLotteryTicketData(account, currentLotteryNumber, lotteryType)
        setLotteryTicketData(data)
      } catch (err) {
        setLotteryTicketData(null)
      }
    }
    if (currentLotteryNumber > 0) {
      fetchRecentLotteryData()
    }
  }, [currentLotteryNumber, lotteryType, account, setLotteryTicketData, fastRefresh])

  useEffect(() => {
    if (lotteryTicketData && lotteryTicketData.length > 0) {
      let tempRewardSum = new BigNumber(0)
      const tempRewardTicketIds = []

      for (let i = 0; i < lotteryTicketData.length; i++) {
        tempRewardSum = tempRewardSum.plus(lotteryTicketData[i].ticketReward)
        if (lotteryTicketData[i].ticketReward.gt(0) && !lotteryTicketData[i].ticketClaim)
          tempRewardTicketIds.push(lotteryTicketData[i].ticketNo)
      }

      setRewardSum(tempRewardSum)
      setRewardTicketIds(tempRewardTicketIds)
    } else {
      setRewardSum(new BigNumber(0))
      setRewardTicketIds([])
    }
  }, [lotteryTicketData, setRewardSum, setRewardTicketIds])

  const handleBatchClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)

      await Promise.all(
        lotteryTotalPrizeData.rewardTicketData.map(async (data) => {
          const array = data.split(',')
          const lotteryId = array[0]
          const ticketIds = array.slice(1)
          await claimReward(lotteryContract, lotteryId, ticketIds, account, gasBoostedPrice)
        }),
      )
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedClaim(false)
    }
  }, [setRequestedClaim, lotteryTotalPrizeData, account, lotteryContract, gasBoostedPrice])

  return (
    <>
      {lotteryTotalPrizeData.rewardTicketData.length > 0 && (
        <ClaimDiv>
          <Button onClick={handleBatchClaim} disabled={requestedClaim}>
            {`${t('Collect')} (${lotteryTotalPrizeData.rewardTicketData.length} / ${
              lotteryTotalPrizeData.totalPrize
            } ${lotteryType.toUpperCase()})`}
          </Button>
        </ClaimDiv>
      )}
      <Cards>
        <div>
          <TotalPrizesCard />
        </div>
        <SecondCardColumnWrapper isAWin={isAWin}>
          {!account ? (
            <UnlockWalletCard />
          ) : (
            <>
              <YourPrizesCard
                isAWin={isAWin}
                tickets={lotteryTicketData}
                rewardTicketIds={rewardTicketIds}
                winnings={rewardSum.div(10 ** 18).toFormat(2)}
              />
              <TicketCard isSecondCard={isAWin} tickets={lotteryTicketData} />
            </>
          )}
        </SecondCardColumnWrapper>
      </Cards>
      {/* <HowItWorks /> */}
      {/* legacy page content */}
      <WinningNumbers />
      <HowItWorks2 />
    </>
  )
}

export default NextDrawPage
