import React from 'react'
import styled from 'styled-components'
import { Text } from 'archerswap-uikit'
import formatLotteryDate from '../helpers/formatLotteryDate'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  @media (max-width: 768px) {
    position: relative;
    margin-bottom: 20px;
  }
`

const Timestamp = ({ startTime, endTime }) => {
  const { monthAndDay: startMonthAndDay, hours: startHours } = formatLotteryDate(startTime)
  const { monthAndDay: endMonthAndDay, hours: endHours } = formatLotteryDate(endTime)

  return (
    <Wrapper>
      <Text fontSize="14px">
        {startMonthAndDay}, {startHours}:00 UTC - {endMonthAndDay}, {endHours}:00 UTC
      </Text>
    </Wrapper>
  )
}

export default Timestamp
