import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardRibbon, Text, LinkExternal, Link, Box } from 'archerswap-uikit'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import useGetPublicIfoData from '../../hooks/useGetPublicIfoData'
import IfoCardHeader from './IfoCardHeader'
import IfoCardDetails from './IfoCardDetails'
import IfoCardActions from './IfoCardActions'
import IfoCardProgress from './IfoCardProgress'
import IfoCardTime from './IfoCardTime'

export interface IfoCardProps {
  ifo: Ifo
}

const StyledCardRibbon = styled(CardRibbon)`
  font-size: 12px;
`
const StyledIfoCard = styled(Card)<{ ifoId: string }>`
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.png')`};
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 105px;
  margin-left: auto;
  margin-right: auto;
  max-width: 437px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 5px rgba(105, 105, 105, 0.15);
`
const getRibbonComponent = (status: IfoStatus, t: (fallback: string) => any, isPrivate: boolean) => {
  if (status === 'live') {
    return <CardRibbon variantColor="primary" text={t('LIVE NOW!')} />
  }

  return <StyledCardRibbon variantColor="textDisabled" text={t(isPrivate ? 'Private Sale' : 'Public Sale')} />
}

const Item = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
`

const Display = styled(Text)`
  flex: 1;
`

const IfoCard: React.FC<IfoCardProps> = ({ ifo }) => {
  const {
    id,
    isPrivate,
    name,
    subTitle,
    projectSiteUrl,
    launchDate,
    launchTime,
    saleAmount,
    raiseAmount,
    maxDepositAmount,
    currency,
  } = ifo
  const publicIfoData = useGetPublicIfoData(ifo)
  const { raisingAmount, totalAmount } = publicIfoData
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const Ribbon = getRibbonComponent(publicIfoData.status, t, isPrivate)

  return (
    <StyledIfoCard ifoId={id} ribbon={Ribbon} isActive={publicIfoData.status === 'live'}>
      <CardBody style={{ padding: '30px' }}>
        <IfoCardHeader ifoId={id} name={t(name)} subTitle={subTitle} />
        {publicIfoData.status !== 'finished' && ifo.isActive && (
          <>
            <IfoCardProgress progress={publicIfoData.progress} />
            <IfoCardTime
              status={publicIfoData.status}
              secondsUntilStart={publicIfoData.secondsUntilStart}
              secondsUntilEnd={publicIfoData.secondsUntilEnd}
              startTime={publicIfoData.startTimestamp}
              endTime={publicIfoData.endTimestamp}
              // blocksRemaining={publicIfoData.blocksRemaining}
              // blocksRemainingToStart={publicIfoData.blocksRemainingToStart}
              // block={publicIfoData.startTimestamp}
              // blockToEnd={publicIfoData.endTimestamp}
            />
          </>
        )}
        {account ? <IfoCardActions ifo={ifo} publicIfoData={publicIfoData} /> : <UnlockButton width="100%" />}
        <div style={{ marginTop: '20px' }}>
          <Box mb="24px">
            <Item>
              <Display fontSize="14px" bold>
                {t('Launch Time')}
              </Display>
              <Text fontSize="14px" bold>
                {launchDate},
                <Link
                  href="https://www.timeanddate.com/worldclock/singapore/singapore"
                  target="blank"
                  rel="noopener noreferrer"
                  ml="4px"
                  style={{ display: 'inline' }}
                  color="text"
                  fontSize="14px"
                >
                  {launchTime}
                </Link>
              </Text>
            </Item>
            <Item>
              <Display fontSize="14px" bold>
                {t('For Sale')}
              </Display>
              <Text fontSize="14px" bold>
                {saleAmount}
              </Text>
            </Item>
            <Item>
              <Display fontSize="14px" bold>
                {t('To raise (USD)')}
              </Display>
              <Text fontSize="14px" bold>
                {raiseAmount}
              </Text>
            </Item>
            <Item>
              <Display fontSize="14px" bold>
                {t('Total raised (% of target)')}
              </Display>
              <Text fontSize="14px" bold>{`${totalAmount.div(raisingAmount).times(100).toFixed(2)}%`}</Text>
            </Item>
            {maxDepositAmount > 0 && (
              <Item>
                <Display fontSize="14px" bold>
                  {t('Max deposit amount')}
                </Display>
                <Text fontSize="14px" bold>{`${maxDepositAmount.toFixed(2)} ${currency}`}</Text>
              </Item>
            )}
          </Box>
          <LinkExternal href={projectSiteUrl} style={{ margin: 'auto' }}>
            {t('View Project Site')}
          </LinkExternal>
        </div>
      </CardBody>
      <IfoCardDetails ifo={ifo} publicIfoData={publicIfoData} />
    </StyledIfoCard>
  )
}

export default IfoCard
