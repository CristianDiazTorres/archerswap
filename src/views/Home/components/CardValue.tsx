import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from 'archerswap-uikit'
import styled from 'styled-components'

export interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  lineHeight?: string
  prefix?: string
  bold?: boolean
  color?: string
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '22px',
  lineHeight = '1',
  prefix = '',
  bold = true,
  color = 'text',
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  const BowText = styled.div`
    .BowStyle {
      font-family: 'Doppio One';
      font-style: normal;
      font-weight: 400;
      font-size: 22px;
      line-height: 28px;
      padding-top: 2px;
    }
  `

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <BowText>
      <Text bold={bold} fontSize={fontSize} style={{ lineHeight }} color={color} className="BowStyle">
        {prefix}
        {countUp}
      </Text>
    </BowText>
  )
}

export default CardValue
