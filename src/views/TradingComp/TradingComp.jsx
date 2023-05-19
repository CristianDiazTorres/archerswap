import { Flex, Button, Card, CardBody, CardHeader, Heading, Text, TimerIcon } from 'archerswap-uikit'
import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useRefresh from 'hooks/useRefresh'
import useWeb3 from 'hooks/useWeb3'
import tradeABI from 'config/abi/trading.json'
import axios from 'axios'
import tradingCampaigns from 'config/constants/tradingCampaigns'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

const BannerContainer = styled.div`
  position: relative;
`
const StyledBanner = styled.img`
  width: 100%;
  height: 100%;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`
const StyledContent = styled.div`
  z-index: 10;
  height: 45%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  top: 23%;
  left: 7%;
  bottom: 0;
  ${({ theme }) => theme.mediaQueries.md} {
    top: 15%;
    height: 60%;
    left: 15%;
  }
`
const TimerContainer = styled.div`
  display: block;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`
const ButtonContainer = styled.div`
  margin-top: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
  }
`
const StyledMobileBanner = styled.img`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`
const Row = styled.tr``
const Cell = styled.td`
  padding: 2% 1%;
  border: 1px solid gray;
`
const CellHead = styled.th`
  padding: 2% 1%;
  text-align: left;
  border: 1px solid gray;
`
const Table = styled.table`
  width: 100%;
`
const ScoreSection = styled.div`
  margin: 4% 1%;
`
const CustomFlexBox = styled(Flex)`
  display: flex;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`
const CampaignCard = styled(Card)`
  width: 25em;
  margin: 2%;
`
function TradingComp({ id }) {
  const campainData = tradingCampaigns[id]
  const [rankings, setRankings] = useState([])
  const [userData, setUserData] = useState({
    block: '0',
    id: '0',
    txCount: '0',
    volumeCORE: '0',
    volumeUSD: '0',
    volumeBuyUSD: '0',
    idx: 0,
    isRegistered: false,
    hasClaimed: false,
  })
  const { account } = useWeb3React()
  const [competitionDataFromSubgraph, setCompetitionDataFromSubgraph] = useState({
    id: '0',
    status: '0',
    userCount: '0',
    volumeCORE: '0',
    volumeBuyCORE: '0',
    volumeBuyUSD: '0',
    volumeUSD: '0',
    txCount: 0,
  })
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  /* eslint-disable  */

  const tradeContract = new web3.eth.Contract(tradeABI, campainData?.contractAddress)
  useEffect(() => {
    const fetchData = () => {
      axios
        .post(campainData?.subgraph, {
          query: `{

        competition(id: 1) {
            volumeUSD
            volumeBuyUSD
            volumeBuyCORE
            volumeCORE
            id
            status
            userCount
            txCount
            users(orderBy:volumeUSD,orderDirection:desc) {
              id
              txCount
              volumeUSD
              volumeCORE
              volumeBuyUSD
            }
          }
          user(id:"${account ? account?.toLowerCase() : '0x0000000000000000000000000000000000000000'}"){
            id
          txCount
          volumeUSD
          volumeBuyUSD
          volumeCORE
          block 
      }
    
}`,
        })
        .then((res) => {
          if (res?.data?.data) {
            const data = res?.data.data
            setCompetitionDataFromSubgraph(data.competition)
            setRankings(data.competition.users)
            const idx = data.competition.users?.findIndex((el) => el.id === account.toLowerCase())

            if (data.user) {
              setUserData({ ...data.user, idx: idx + 1, isRegistered: true })
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }

    fetchData()
  }, [account, campainData?.subgraph, fastRefresh])

  const handleRegister = async () => {
    if (account && web3) {
      const tx = await tradeContract.methods.register().send({
        from: account,
      })
      if (tx) {
        setUserData({ isRegistered: true })
      }
    }
  }
  return (
    <div>
      <BannerContainer>
        <StyledMobileBanner src={'/images/assets/banners/mobile_xbow_banner.png'} alt={'banner'} />
        <StyledBanner src={'/images/assets/banners/xbow_banner.png'} alt={'banner'} />
        <StyledContent>
          <div>
            <Heading as="h1" size="xl" color="extra" mb="10px">
              {campainData?.tokenName} Trading Campaign
            </Heading>
            <TimerContainer>
              <Flex alignItems="center" mr={2}>
                <TimerIcon color="dark" /> <Text color="dark">{campainData.start}</Text>
              </Flex>
              <Flex alignItems="center">
                {' '}
                <TimerIcon color="dark" />
                <Text color="dark"> {campainData.end}</Text>
              </Flex>
            </TimerContainer>
            {/* <Text mb="10px" color="dark">
              Take part in the competition with exclusive prizes
            </Text> */}
            <ButtonContainer>
              <Button variant="contained" color="dark" onClick={handleRegister}>
                {' '}
                {userData?.isRegistered ? 'Registered' : 'Register Now'}
              </Button>
              <Button as="a" ml={2} href={campainData?.tradingUrl}>
                {' '}
                Trade {campainData?.pairs.map((el) => el)}
              </Button>
            </ButtonContainer>
          </div>
        </StyledContent>
      </BannerContainer>

      <br />
      <CustomFlexBox>
        {campainData?.subCampaigns.map((el, idx) => (
          <>
            {' '}
            <CampaignCard>
              <CardHeader>
                <Heading as="h1">{el?.cardTitle}</Heading>
              </CardHeader>
              <CardBody>
                <Heading as="h1" mb="10px" mt="10px">
                  {el?.title} <br /> {el?.subTitle}{' '}
                  <Heading as="h1" color="primary">
                    {el?.reward}
                  </Heading>
                </Heading>
                <Button>Learn More</Button>
              </CardBody>
            </CampaignCard>
          </>
        ))}
      </CustomFlexBox>
      <CustomFlexBox>
        <CampaignCard>
          <CardBody>
            <Heading as="h1" mb="10px" mt="10px">
              Volume Generated
            </Heading>
            <Heading as="h1" mb="10px" mt="10px">
              $ {new BigNumber(competitionDataFromSubgraph?.volumeBuyUSD).toFormat(2)}
            </Heading>
          </CardBody>
        </CampaignCard>
        <CampaignCard>
          <CardBody>
            <Heading as="h1" mb="10px" mt="10px">
              Total Participants
            </Heading>
            <Heading as="h1" mb="10px" mt="10px">
              {new BigNumber(competitionDataFromSubgraph?.userCount).toFormat(0)}
            </Heading>
          </CardBody>
        </CampaignCard>
        <CampaignCard>
          <CardBody>
            <Heading as="h1" mb="10px" mt="10px">
              Total Transactions
            </Heading>
            <Heading as="h1" mb="10px" mt="10px">
              {new BigNumber(competitionDataFromSubgraph?.txCount).toFormat(0)}
            </Heading>
          </CardBody>
        </CampaignCard>
      </CustomFlexBox>
      <CustomFlexBox>
        <CampaignCard>
          <CardHeader>
            <Heading as="h1">My Score</Heading>
          </CardHeader>
          <CardBody>
            <Flex flexDirection="column">
              <ScoreSection>
                <Text>Account</Text>

                <Heading as="h1">
                  {account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
                </Heading>
              </ScoreSection>
              <ScoreSection>
                <Text>Your Trading Volume</Text>
                <Heading as="h1">
                  $ {parseInt(userData?.volumeBuyUSD) > 0 ? new BigNumber(userData.volumeBuyUSD).toFixed(0) : '0'}
                </Heading>
              </ScoreSection>
              <ScoreSection>
                <Text>Your Ranking</Text>
                <Heading as="h1">{userData?.idx || '100+'}</Heading>
              </ScoreSection>
              <ScoreSection>
                <Text>Your Transaction Count</Text>
                <Heading as="h1">{userData?.txCount || 0}</Heading>
              </ScoreSection>
            </Flex>
          </CardBody>
        </CampaignCard>
        <Card style={{ flexGrow: 2, margin: '2%' }}>
          <CardHeader>
            <Heading as="h1">Ranking Table</Heading>
          </CardHeader>
          <CardBody style={{ height: '25em', overflow: 'scroll' }}>
            <Table>
              <thead>
                <CellHead>Rank</CellHead>
                <CellHead>Account</CellHead>
                <CellHead>Txn Count</CellHead>
                <CellHead>Volume USD</CellHead>
              </thead>
              <tbody>
                {rankings.map((row, idx) => {
                  return (
                    <Row>
                      <Cell>{idx === 0 ? <> {idx + 1} </> : idx + 1}</Cell>
                      <Cell>
                        {row?.id?.substring(0, 6)}...{row?.id?.substring(row?.id?.length - 6)}{' '}
                      </Cell>
                      <Cell>{row.txCount}</Cell>
                      <Cell>{new BigNumber(row.volumeBuyUSD).toFormat(1)}</Cell>
                    </Row>
                  )
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </CustomFlexBox>
    </div>
  )
}

export default TradingComp
