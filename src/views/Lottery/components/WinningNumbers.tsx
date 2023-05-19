import React, { useContext, useState, useEffect, useRef } from 'react'
import { CSVLink } from 'react-csv'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useRefresh from 'hooks/useRefresh'
import { Image, Card, CardBody } from 'archerswap-uikit'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { fetchLotteryInfo, exportLotteryInfo } from 'utils/fetchLotteryData'
import { useTranslation } from 'contexts/Localization'
// import { isExportDeclaration } from 'typescript'

const WinningNumbers: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)
  const { fastRefresh } = useRefresh()
  const [lotteryNo, setLotteryNo] = useState(currentLotteryNumber)
  const [winNumbers, setWinNumbers] = useState([0, 0, 0, 0])
  const [winnerCounts, setWinnerCounts] = useState([0, 0, 0, 0])
  const [lotteryData, setLotteryData] = useState([])
  const [exporting, setExporting] = useState(false)

  const csvLinkEl = useRef<{ link: HTMLAnchorElement }>(null)

  const exportHeaders = [
    { label: 'Lottery No', key: 'lotteryNo' },
    { label: 'Total Pool Amount', key: 'totalPoolAmount' },
    { label: '4 matches', key: 'match4' },
    { label: '3 matches', key: 'match3' },
    { label: '2 matches', key: 'match2' },
  ]

  useEffect(() => {
    /* eslint-disable */
    async function getLotteryInfo(lotteryNumber, lotteryType) {
      for (let i = lotteryNumber; i > 0; i--) {
        const lotteryInfo = await fetchLotteryInfo(i, lotteryType)
        if (lotteryInfo && lotteryInfo.lotteryStatus === 4) {
          setLotteryNo(i)
          setWinNumbers(lotteryInfo.winningNumbers)
          setWinnerCounts(lotteryInfo.winnerCounts)
          break
        } else {
          setWinNumbers([0, 0, 0, 0])
          setWinnerCounts([0, 0, 0, 0])
        }
      }
    }
    /* eslint-enable */
    if (currentLotteryNumber > 0) getLotteryInfo(currentLotteryNumber, lotteryType)
  }, [currentLotteryNumber, fastRefresh, lotteryType])

  const onExport = async () => {
    if (exporting) return
    setExporting(true)
    const data = await exportLotteryInfo(currentLotteryNumber, lotteryType)
    setLotteryData(data)
    setTimeout(() => {
      if (csvLinkEl?.current) csvLinkEl.current.link.click()
    }, 1000)
    setExporting(false)
  }

  return (
    <CardWrapper>
      <Card>
        <CardBody>
          <StyledCardContentInner>
            <StyledCardHeader>
              <Title>
                {account && lotteryNo === currentLotteryNumber
                  ? `${t('Winning Numbers This Round')}`
                  : t('Latest Winning Numbers')}
              </Title>
              <br />
            </StyledCardHeader>
            <RabbitRow>
              <RabbitBox>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 1" width={65} height={129} responsive />
                </CardImage>
              </RabbitBox>
              <RabbitBox>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 2" width={65} height={129} responsive />
                </CardImage>
              </RabbitBox>
              <RabbitBox>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 3" width={65} height={129} responsive />
                </CardImage>
              </RabbitBox>
              <RabbitBox>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 4" width={65} height={129} responsive />
                </CardImage>
              </RabbitBox>
            </RabbitRow>
            <RabbitRowSmall>
              <RabbitBoxSmall>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 1" width={60} height={119} responsive />
                </CardImage>
              </RabbitBoxSmall>
              <RabbitBoxSmall>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 2"width={60} height={119} responsive />
                </CardImage>
              </RabbitBoxSmall>
              <RabbitBoxSmall>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 3"width={60} height={119} responsive />
                </CardImage>
              </RabbitBoxSmall>
              <RabbitBoxSmall>
                <CardImage>
                  <Image src="/images/assets/lotteryImage2.svg" alt="Number 4"width={60} height={119} responsive />
                </CardImage>
              </RabbitBoxSmall>
            </RabbitRowSmall>
            <Row>
              {winNumbers.map((number, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <TicketNumberBox key={index}>
                  <CenteredText>{number}</CenteredText>
                </TicketNumberBox>
              ))}
            </Row>
            <Column>
              <div>
                <RowNoPadding>
                  <CenteredTextWithPadding>{t('Tickets matching 4 numbers:')}</CenteredTextWithPadding>
                  <CenteredTextWithPadding>
                    <strong>{winnerCounts[3]}</strong>
                  </CenteredTextWithPadding>
                </RowNoPadding>
                <RowNoPadding>
                  <CenteredTextWithPadding>{t('Tickets matching 3 numbers:')}</CenteredTextWithPadding>
                  <CenteredTextWithPadding>
                    <strong>{winnerCounts[2]}</strong>
                  </CenteredTextWithPadding>
                </RowNoPadding>
                <RowNoPadding>
                  <CenteredTextWithPadding>{t('Tickets matching 2 numbers:')}</CenteredTextWithPadding>
                  <CenteredTextWithPadding>
                    <strong>{winnerCounts[1]}</strong>
                  </CenteredTextWithPadding>
                </RowNoPadding>
              </div>
            </Column>
            <div
              style={{ color: '#EAAA08', marginTop: '10px', cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onClick={() => onExport()}
              onKeyDown={() => onExport()}
            >
              {exporting ? t('Exporting...') : t('Export recent winning numbers')}
            </div>
            <CSVLink headers={exportHeaders} filename="lotteryData.csv" data={lotteryData} ref={csvLinkEl} />
          </StyledCardContentInner>
        </CardBody>
      </Card>
    </CardWrapper>
  )
}
// const Link = styled.a`
//   margin-top: 1em;
//   text-decoration: none;
//   color: #25beca;
// `

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const RabbitRow = styled.div`
  margin-bottom: -5em;
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 18px;

  @media (max-width: 768px) {
    display: none;
  }
`

const RabbitRowSmall = styled.div`
  margin-bottom: -3.8em;
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 4px;

  @media (min-width: 768px) {
    display: none;
  }
`

const CardImage = styled.div`
  text-align: center;

  @media (max-width: 768px) {
  }
`

const RowNoPadding = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  margin-top: 1em;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const CenteredText = styled.div`
  text-align: center;
  align-items: center;
`

const CenteredTextWithPadding = styled.div`
  text-align: center;
  align-items: center;
  padding-left: 2px;
  padding-right: 2px;
`

const TicketNumberBox = styled.div`
  padding: 10px;
  border-radius: 12px;
  background: linear-gradient(265.22deg, #ED952E 0%, #F7CE47 100%);;
  color: white;
  font-size: 20px;
  font-weight: 900;
  margin: 10px;
  margin-bottom: 7px;
  width: 60px;
  height: 60px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    font-size: 40px;
    margin: 20px;
    width: 80px;
    height: 80px;
  }
`

const RabbitBox = styled.div`
  /* padding: 10px; */
  border-radius: 12px;
  margin: 16px 20px;
  width: 60px;
`

const RabbitBoxSmall = styled.div`
  border-radius: 12px;
  margin: 20px;
  width: 40px;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const CardWrapper = styled.div``

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 22px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default WinningNumbers
