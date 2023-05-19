import React from 'react'
import styled from 'styled-components'
import { Flex, Link } from 'archerswap-uikit'
import { IfoStatus } from 'config/constants/types'
import getTimePeriods from 'utils/getTimePeriods'
// import { useTranslation } from 'contexts/Localization'

export interface IfoCardTimeProps {
  status: IfoStatus
  secondsUntilStart: number
  secondsUntilEnd: number
  startTime: number
  endTime: number
  // blocksRemaining: number
  // blocksRemainingToStart: number
  // block: number
  // blockToEnd: number
}

const Details = styled.div`
  align-items: center;
  display: flex;
  height: 24px;
  justify-content: center;
  margin-bottom: 24px;
`

// const Countdown = styled.div`
//   color: ${({ theme }) => theme.colors.secondary};
//   font-size: 20px;
//   font-weight: 600;
//   text-align: center;
// `

const IfoCardTime: React.FC<IfoCardTimeProps> = ({
  status,
  secondsUntilStart,
  secondsUntilEnd,
  startTime,
  endTime,
  // block,
  // blockToEnd,
  // blocksRemaining,
  // blocksRemainingToStart,
}) => {
  // const { t } = useTranslation()
  // const countdownToUse = status === 'coming_soon' ? secondsUntilStart : secondsUntilEnd
  // const blockCount = status === 'coming_soon' ? blocksRemainingToStart : blocksRemaining
  const timeCount = status === 'coming_soon' ? secondsUntilStart : secondsUntilEnd
  const timeUntil = getTimePeriods(timeCount)
  // const suffix = status === 'coming_soon' ? 'start' : 'finish'

  if (status === 'idle') {
    return (
      <Flex alignItems="center" justifyContent="center" mb="24px" height="24px">
        Loading...
      </Flex>
    )
  }

  return (
    <Details>
      {/* <Countdown>{`${timeUntil.days}d, ${timeUntil.hours}h, ${timeUntil.minutes}m until ${suffix}`}</Countdown> */}
      <Link
        href={`https://www.epochconverter.com/countdown?q=${status === 'coming_soon' ? startTime : endTime}`}
        target="blank"
        rel="noopener noreferrer"
        ml="8px"
      >
        {`${timeUntil.days} ${timeUntil.days === 1 ? 'day' : 'days'}
          ${timeUntil.hours} ${timeUntil.hours === 1 ? 'hr' : 'hrs'}
          ${timeUntil.minutes} ${timeUntil.minutes === 1 ? 'min' : 'mins'} `}
        {status === 'coming_soon' ? 'until start' : 'until finish'}
      </Link>
    </Details>
  )
}

export default IfoCardTime
