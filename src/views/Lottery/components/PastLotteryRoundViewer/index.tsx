import React, { useState, useEffect, useContext, useCallback } from 'react'
import styled from 'styled-components'
import { Card, CardBody } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useRefresh from 'hooks/useRefresh'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { fetchLotteryInfo } from 'utils/fetchLotteryData'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'
import Loading from '../Loading'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledCardBody = styled(CardBody)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 552px; // height of final card
`

const PastLotteryRoundViewer = () => {
  const { t } = useTranslation()

  const [state, setState] = useState({
    roundData: null,
    error: { message: t('The lottery number you provided does not exist'), type: 'web3' },
    isInitialized: true,
    isLoading: false,
  })

  const { roundData, error, isInitialized, isLoading } = state
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)
  const [lotteryNo, setLotteryNo] = useState(0)
  const { fastRefresh } = useRefresh()

  const handleSubmit = useCallback(
    async (lotteryNumber: number) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
      }))

      try {
        const data = await fetchLotteryInfo(lotteryNumber, lotteryType)
        setState((prevState) => ({
          ...prevState,
          error: { message: null, type: null },
          roundData: data,
          isLoading: false,
          isInitialized: true,
        }))
      } catch (e) {
        setState((prevState) => ({
          ...prevState,
          error: { message: t('The lottery number you provided does not exist'), type: 'web3' },
          isLoading: false,
          isInitialized: true,
        }))
      }
    },
    [setState, t, lotteryType],
  )

  useEffect(() => {
    if (lotteryNo > 0) handleSubmit(lotteryNo)
  }, [lotteryNo, handleSubmit])

  useEffect(() => {
    /* eslint-disable */
    async function getLotteryInfo(lotteryNumber) {
      for (let i = lotteryNumber; i > 0; i--) {
        const lotteryInfo = await fetchLotteryInfo(i, lotteryType)
        if (lotteryInfo && lotteryInfo.lotteryStatus === 4) {
          setLotteryNo(i)
          break
        }
      }
    }
    /* eslint-enable */
    if (currentLotteryNumber > 0) getLotteryInfo(currentLotteryNumber)
    else setLotteryNo(0)
  }, [currentLotteryNumber, fastRefresh, lotteryType])

  return (
    <Wrapper>
      <PastLotterySearcher initialLotteryNumber={lotteryNo} onSubmit={handleSubmit} />
      {!isInitialized || isLoading ? (
        <Card>
          <StyledCardBody>
            <Loading />
          </StyledCardBody>
        </Card>
      ) : (
        <PastRoundCard error={error} data={roundData} />
      )}
    </Wrapper>
  )
}

export default PastLotteryRoundViewer
