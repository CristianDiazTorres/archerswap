import React from 'react'
import styled from 'styled-components'
import { useFarmUser } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text } from 'archerswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'

export interface FarmProps {
  label: string
  pid: number
  image: string
}

const IconImage = styled.div`
  display: flex;
  margin-right: 15px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 5px;
  }
  .first {
    position: relative;
    display: block;
    border-radius: 50%;
    z-index: 2;
    width: 20px;
    height: 20px;

    ${({ theme }) => theme.mediaQueries.sm} {
      width: 30px;
      height: 30px;
    }
  }
  .last {
    z-index: 3;
    display: block;
    margin-left: -7px;
    border-radius: 50%;
    width: 20px;
    height: 20px;

    ${({ theme }) => theme.mediaQueries.sm} {
      width: 30px;
      height: 30px;
      margin-left: -12px;
    }
  }
`

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold>
          {t('Farming')}
        </Text>
      )
    }

    return null
  }

  return (
    <Container>
      <IconImage>
        <img className="first" src={`/images/tokens/${label.split('-')[0].toLocaleLowerCase()}.png`} alt="icon" />
        <img className="last" src={`/images/tokens/${label.split('-')[1].toLocaleLowerCase()}.png`} alt="icon" />
      </IconImage>
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm
