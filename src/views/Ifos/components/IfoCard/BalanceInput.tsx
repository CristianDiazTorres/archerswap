import React from 'react'
import styled from 'styled-components'
import { Button, Box, BoxProps, Flex, Input as UIKitInput, Text } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

export interface BalanceInputProps extends BoxProps {
  title: string
  max: number
  symbol: string
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
  value: string
  onSelectMax?: () => void
}

const StyledBalanceInput = styled(Box)`
  background: ${({ theme }) => theme.colors.input};
  box-shadow: 0px 2px 2px -1px rgba(0, 0, 0, 0.2) inset;
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 8px 16px;
`

const Input = styled(UIKitInput)`
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  box-shadow: none;
  flex: 1;
`

// const TokenSymbol = styled(Text)`
//   max-width: 120px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   flex: 1;
// `

const BalanceInput: React.FC<BalanceInputProps> = ({ title, max, symbol, onChange, onSelectMax, value, ...props }) => {
  const { t } = useTranslation()
  const maxDisplay = max.toFixed(2)

  return (
    <StyledBalanceInput {...props}>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text fontSize="14px">{title}</Text>
        <Text fontSize="14px">{t('Balance: %balance%', { balance: maxDisplay })}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Input onChange={onChange} placeholder="0" value={value} type="number" style={{ marginRight: '10px' }} />
        {onSelectMax && (
          <Button scale="sm" onClick={onSelectMax} mr="8px">
            Max
          </Button>
        )}
        <Text fontSize="14px">{symbol}</Text>
      </Flex>
    </StyledBalanceInput>
  )
}

export default BalanceInput
