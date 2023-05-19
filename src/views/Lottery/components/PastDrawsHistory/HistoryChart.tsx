import React, { lazy, Suspense, useState, useEffect, useContext } from 'react'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { fetchLotteryGraphData } from 'utils/fetchLotteryData'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import Loading from '../Loading'

const Line = lazy(() => import('./LineChartWrapper'))

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HistoryChart: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [idList, setIdList] = useState(['1'])
  const [poolData, setPoolData] = useState([0])
  const [burnedData, setBurnedData] = useState([0])
  const { isDark } = useTheme()
  const { currentLotteryNumber, lotteryType } = useContext(PastLotteryDataContext)

  useEffect(() => {
    async function getGraphData(startLotteryNo, endLotteryNo) {
      setLoading(true)
      try {
        const graphData = await fetchLotteryGraphData(startLotteryNo, endLotteryNo, lotteryType)
        if (graphData && graphData.idList.length > 0) {
          if (Number(graphData.poolData[graphData.idList.length - 1]) === 0) {
            setIdList(graphData.idList.slice(0, -1))
            setPoolData(graphData.poolData.slice(0, -1))
            setBurnedData(graphData.burnedData.slice(0, -1))
          } else {
            setIdList(graphData.idList)
            setPoolData(graphData.poolData)
            setBurnedData(graphData.burnedData)
          }
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    if (currentLotteryNumber > 0) getGraphData(1, currentLotteryNumber)
  }, [currentLotteryNumber, lotteryType])

  const lineStyles = ({ color }) => {
    return {
      borderColor: color,
      fill: false,
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
    }
  }

  const chartData = {
    labels: idList,
    datasets: [
      {
        label: 'Pool Size',
        data: poolData,
        yAxisID: 'y-axis-pool',
        ...lineStyles({ color: isDark ? '#FFF' : '#000' }),
      },
      {
        label: 'Burned',
        data: burnedData,
        yAxisID: 'y-axis-burned',
        ...lineStyles({ color: '#EAAA08' }),
      },
    ],
  }

  const axesStyles = ({ color, lineHeight }) => {
    return {
      borderCapStyle: 'round',
      gridLines: { display: false },
      ticks: {
        fontFamily: 'Kanit, sans-serif',
        fontColor: color,
        fontSize: 14,
        lineHeight,
        maxRotation: 0,
        beginAtZero: true,
        autoSkipPadding: 15,
        userCallback: (value) => {
          return value.toLocaleString()
        },
      },
    }
  }

  const options = {
    legend: { display: false },
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-pool',
          ...axesStyles({ color: isDark ? '#FFF' : '#000', lineHeight: 1.6 }),
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-burned',
          ...axesStyles({ color: '#EAAA08', lineHeight: 1.5 }),
        },
      ],
      xAxes: [
        {
          ...axesStyles({ color: isDark ? '#FFF' : '#000', lineHeight: 1 }),
        },
      ],
    },
  }

  return (
    <>
      {!loading ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Line data={chartData} options={options} type="line" />
        </Suspense>
      ) : (
        <InnerWrapper>
          <Loading />
        </InnerWrapper>
      )}
    </>
  )
}

export default HistoryChart
