import React from 'react'
import styled from 'styled-components'
import { useVaultUser } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text, Image } from 'archerswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'

export interface VaultProps {
  label: string
  pid: number
  image: string
  provider?: string
}

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
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

const Vault: React.FunctionComponent<VaultProps> = ({ label, pid, provider }) => {
  const { stakedBalance } = useVaultUser(pid, provider)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderVaulting = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold>
          {t('Staked')}
        </Text>
      )
    }

    return null
  }

  return (
    <Container>
      {/* <IconImage src={`/images/farms/${image}.svg`} alt="icon" width={40} height={40} mr="8px" /> */}
      <IconImage src={`/images/farms/${label.toLocaleLowerCase()}.svg`} alt="icon" width={40} height={40} mr="8px" />
      <div>
        {handleRenderVaulting()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Vault
