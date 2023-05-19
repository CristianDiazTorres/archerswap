import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Input, InputProps } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  availableSymbol: string
  value: string
  onSelectMax?: () => void
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
}

const TicketInput: React.FC<TokenInputProps> = ({ symbol, onChange, onSelectMax, value }) => {
  const { t } = useTranslation()

  return (
    <StyledTokenInput>
      <StyledFlex alignItems="center">
        <StyledInput onChange={onChange} placeholder="0" value={value} />
        <StyledTokenAdornmentWrapper>
          <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
          <StyledSpacer />
          <div>
            <StyledButton size="sm" onClick={onSelectMax}>
              {t('Max')}
            </StyledButton>
          </div>
        </StyledTokenAdornmentWrapper>
      </StyledFlex>
      {/* <StyledMaxText>{t(`${max.toLocaleString()} ${availableSymbol} Available`)}</StyledMaxText> */}
    </StyledTokenInput>
  )
}

const StyledTokenInput = styled.div``

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

// const StyledMaxText = styled.div`
//   align-items: center;
//   color: ${(props) => props.theme.colors.primary};
//   display: flex;
//   font-size: 14px;
//   font-weight: 700;
//   height: 44px;
//   justify-content: flex-end;
// `

const StyledTokenSymbol = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 700;
`

const StyledFlex = styled(Flex)`
  border: 1px solid ${(props) => props.theme.colors.text};
`

const StyledButton = styled(Button)`
  padding: 0px 15px;
  max-height: 30px;
  margin-right: 10px;
  color: black;
  box-shadow: 0px 0px 12px #ffe480;
  border-radius: 7px;
`

const StyledInput = styled(Input)`
  background: transparent;
  outline: none !important;
  box-shadow: none;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`

export default TicketInput
