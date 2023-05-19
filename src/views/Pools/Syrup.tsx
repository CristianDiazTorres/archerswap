import React, { useState, useMemo, useEffect } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex, Card, Button, BaseLayout, useModal } from 'archerswap-uikit'
import { Doughnut } from 'react-chartjs-2'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import { usePools, usePriceBowUsd, useOneDayVolume } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { useXbowApprove } from 'hooks/useApprove'
import { useXbowAllowance } from 'hooks/useAllowance'
import useBowInfo, { useUserInfo, useXbowStake, useXbowUnstake } from 'hooks/useBowInfo'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import UnlockButton from 'components/UnlockButton'
import Banner from '../../components/Banner'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'
import StakeModal from './components/xbow/StakeModal'
import UnstakeModal from './components/xbow/UnstakeModal'
import useTheme from '../../hooks/useTheme'

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)

  const [stackedOnly, setStackedOnly] = useState(false)
  const [update, setUpdate] = useState(false)
  const [timestamp, setTimestamp] = useState(0)
  const { fastRefresh } = useRefresh()

  const onApprove = useXbowApprove()
  const allowance = useXbowAllowance(update)
  const { totalLockedBow, xbowRatio, delayToWithdraw } = useBowInfo()
  const bowPrice = usePriceBowUsd()
  const { bowBalance, xbowBalance, claimableAmount, stakedTime } = useUserInfo()
  const { onStake } = useXbowStake()
  const { onUnstake } = useXbowUnstake()
  const oneDayVolume = useOneDayVolume()
  const { isDark } = useTheme()

  useEffect(() => {
    setTimestamp(Math.floor(new Date().getTime() / 1000))
  }, [fastRefresh])

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || timestamp > pool.endTime),
    [timestamp, pools],
  )
  const stackedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )

  const [onPresentStake] = useModal(<StakeModal max={bowBalance} onConfirm={onStake} />)
  const [onPresentUnstake] = useModal(
    <UnstakeModal max={xbowBalance} onConfirm={onUnstake} deadline={stakedTime + delayToWithdraw} />,
  )

  const data = {
    maintainAspectRatio: false,
    responsive: false,
    datasets: [
      {
        data: [xbowRatio, 1],
        backgroundColor: ['#ED952E', '#6F7A9A26'],
      },
    ],
  }

  const options = {
    legend: {
      display: false,
      position: 'right',
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    cutoutPercentage: 90,
  }

  const renderConnectedBtn = () => {
    return allowance.gt(0) ? (
      <>
        <StyledButton onClick={onPresentStake}>
          <img src="/images/assets/xbow/plus.svg" alt="plus" />
          {t('Stake')}
        </StyledButton>
        <UnstakeButton onClick={onPresentUnstake}>
          <img src="/images/assets/xbow/minus.svg" alt="minus" />
          {t('Unstake')}
        </UnstakeButton>
      </>
    ) : (
      <Button
        onClick={async () => {
          await onApprove()
          setUpdate(!update)
        }}
      >
        {t('Approve')}
      </Button>
    )
  }

  return (
    <Background>
      <Banner
        src="/images/assets/banners/xbow_banner.png"
        mobileSrc="/images/assets/banners/mobile_xbow_banner.png"
        alt="pool_banner"
        title="xBOW"
        text={t('Stake your BOWs here to earn more!')}
      />

      <Page>
        <Container>
          <Text color="bow" fontSize="24px" style={{ whiteSpace: 'nowrap' }}>
            Step 1:
          </Text>
          <Text fontSize="24px">{t('Stake BOW, Receive xBOW Immediately')}</Text>
        </Container>
        <XbowCallout>
          <CardContainer>
            <Flower />
            <LeftStyledCard>
              <Text color="text" fontSize="16px" mb="15px">
                {t(
                  'Stake BOW here and receive xBOW as receipt representing your share of the pool. This pool automatically compounds by using a portion of all trade fees to buy back BOW which means the xBOW to BOW ratio will grow over time!',
                )}
              </Text>
              <Text color="text" fontSize="16px">
                {t(
                  'There is a 4% withdraw fee if $xBOW is withdrawn to BOW within 3 days. 2% is burned and 2% is returned to the $xBOW contract.',
                )}
              </Text>
            </LeftStyledCard>
          </CardContainer>
          <CardContainer>
            <BowCard isDark={isDark}>
              <Text fontSize="22px" fontWeight="bold" textAlign="center" mb="24px">
                1 xBOW
              </Text>
              <CircleWrapper>
                <Doughnut data={data} options={options} />
                <LabelWrapper>
                  <Text color="bow" fontSize="24px" fontWeight="bold">
                    ={xbowRatio.toFormat(4)}
                  </Text>
                  <Text color="textSubtle" fontSize="14px">
                    BOW
                  </Text>
                </LabelWrapper>
              </CircleWrapper>
            </BowCard>
            <StyledCard>
              <InfoSection>
                <Flex alignItems="center" justifyContent="space-between" mb="8px">
                  <Text color="textSubtle">{t('Claimable BOW')}</Text>
                  <ClaimWrapper>
                    <Text fontWeight="bold" textAlign="right">
                      ${claimableAmount.times(bowPrice).toFormat(2)}
                    </Text>
                    <AmountWrapper>
                      <img src="/images/assets/xbow/logo.png" alt="amount" />
                      <Text fontWeight="bold">{claimableAmount.toFormat(2)}</Text>
                    </AmountWrapper>
                  </ClaimWrapper>
                </Flex>
                <Flex alignItems="center" justifyContent="space-between" mb="8px">
                  <Text color="textSubtle">TVL</Text>
                  <Text fontWeight="bold">${totalLockedBow.times(bowPrice).toFormat(2)}</Text>
                </Flex>
                <Flex alignItems="center" justifyContent="space-between" mb="8px">
                  <Text color="textSubtle">{t('Approximate APR')}</Text>
                  <Text fontWeight="bold">
                    {totalLockedBow.isZero()
                      ? 0
                      : new BigNumber(oneDayVolume.oneDayVolumeUSD)
                          .times(0.001)
                          .times(365)
                          .div(totalLockedBow.times(bowPrice))
                          .times(100)
                          .toFormat(2)}
                    %
                  </Text>
                </Flex>
              </InfoSection>
              <ButtonSection>{account ? renderConnectedBtn() : <UnlockButton />}</ButtonSection>
            </StyledCard>
          </CardContainer>
        </XbowCallout>
        <Container>
          <Text color="bow" fontSize="24px">
            Step 2:
          </Text>
          <Text fontSize="24px">{t('Stake xBOW, Earn Tokens of Your Choice Over Time')}</Text>
        </Container>
        <PoolTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {stackedOnly
                ? orderBy(stackedOnlyPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
                : orderBy(openPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
            </>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder'])
              .map((item) => {
                return {
                  ...item,
                  isFinished: item.isFinished || timestamp > item.endTime,
                }
              })
              .map((pool) => (
                <PoolCard key={pool.sousId} pool={pool} />
              ))}
          </Route>
        </FlexLayout>
      </Page>
    </Background>
  )
}
const Background = styled.div`
  // width: 100%;
  // background-image: url('/images/assets/bg4.svg');
  // background-repeat: no-repeat;
  // background-position: top right;
`

// const Hero = styled.div`
//   align-items: center;
//   color: ${({ theme }) => theme.colors.primary};
//   display: grid;
//   grid-gap: 32px;
//   grid-template-columns: 1fr;
//   margin-left: auto;
//   margin-right: auto;
//   max-width: 250px;
//   padding: 48px 0;
//   ul {
//     margin: 0;
//     padding: 0;
//     list-style-type: none;
//     font-size: 16px;
//     li {
//       margin-bottom: 4px;
//     }
//   }
//   img {
//     height: auto;
//     max-width: 100%;
//   }
//   @media (min-width: 576px) {
//     grid-template-columns: 1fr 1fr;
//     margin: 0;
//     max-width: none;
//   }
// `
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 24px;
  font-weight: bold;

  div {
    font-weight: bold;

    &:first-child {
      margin-right: 10px;
    }
  }
`

const CardContainer = styled.div`
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
  border-radius: 16px;
`

const Flower = styled(Card)`
  height: 250px;
  background-image: url('/images/assets/xbow/info.png');
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-top: 30px;

  @media (max-width: 768px) {
    height: 200px;
    padding-top: 50px;
  }
`

const XbowCallout = styled(BaseLayout)`
  border-top: 2px solid #e9e9e9;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  margin: 0 auto;
  padding: 32px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

const StyledCard = styled.div`
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
`

const LeftStyledCard = styled(StyledCard)`
  padding: 36px 43px;
  @media (max-width: 768px) {
    padding: 20px 20px;
  }
`

const BowCard = styled(Card)<{ isDark: boolean }>`
  height: 250px;
  background-image: ${(props) =>
    props.theme.isDark ? "url('/images/assets/xbow/pattern-dark.svg')" : "url('/images/assets/xbow/pattern.svg')"};
  background-repeat: no-repeat;
  background-size: cover;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-top: 30px;

  @media (max-width: 768px) {
    padding-top: 50px;
  }

  canvas {
    max-width: 300px;
    width: 50% !important;
    height: auto !important;
  }
`

const StyledButton = styled(Button)`
  width: 100%;
  margin: 8px 0;

  img {
    margin-right: 12.5px;
  }
`

const UnstakeButton = styled(StyledButton)`
  background: linear-gradient(265.22deg, #ed952e 0%, #f7ce47 100%);
  color: white;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
`

const ButtonSection = styled.div`
  padding: 20px 30px;

  button {
    width: 100%;
  }
`

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`

const LabelWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const ClaimWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const AmountWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  img {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
`

export default Farm
