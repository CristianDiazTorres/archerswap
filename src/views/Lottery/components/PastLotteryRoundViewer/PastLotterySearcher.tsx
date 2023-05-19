import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Input, Button } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

interface PastLotterySearcherProps {
  initialLotteryNumber: number
  onSubmit: (num: number) => void
}

const Wrapper = styled.div`
  margin-bottom: 24px;
`

const SearchWrapper = styled.div`
  position: relative;
`
const InputWrapper = styled.div`
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`

const ButtonWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate(0%, -50%);
  width: auto;
`
const StyledButton = styled(Button)`
  padding: 0px 15px;
  max-height: 30px;
  color: black;
  box-shadow: 0px 0px 12px #ffe480;
  border-radius: 7px;
`

const StyledInput = styled(Input)`
  border: 1px solid ${(props) => props.theme.colors.textDisabled};
  border-radius: 4px;
  outline: none !important;
  box-shadow: none;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`

const PastLotterySearcher: React.FC<PastLotterySearcherProps> = ({ initialLotteryNumber, onSubmit }) => {
  const [lotteryNumber, setLotteryNumber] = useState(initialLotteryNumber)
  const [isError, setIsError] = useState(true)
  const { t } = useTranslation()

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(lotteryNumber)
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(evt.currentTarget.value, 10)

    // The max value will always be the initialLotterNumber which equals
    // the latest lottery round
    setIsError(value > initialLotteryNumber || value <= 0)
    setLotteryNumber(value)
  }

  useEffect(() => {
    setLotteryNumber(initialLotteryNumber)
  }, [initialLotteryNumber, setLotteryNumber])

  return (
    <Wrapper>
      <Text>{t('Select Lottery Number:')}</Text>
      <form onSubmit={handleSubmit}>
        <SearchWrapper>
          <InputWrapper>
            <StyledInput
              value={lotteryNumber}
              type="number"
              isWarning={isError}
              max={initialLotteryNumber}
              onChange={handleChange}
            />
          </InputWrapper>
          <ButtonWrapper>
            <StyledButton type="submit" scale="sm" disabled={isError}>
              {t('Search')}
            </StyledButton>
          </ButtonWrapper>
        </SearchWrapper>
      </form>
    </Wrapper>
  )
}

export default PastLotterySearcher
