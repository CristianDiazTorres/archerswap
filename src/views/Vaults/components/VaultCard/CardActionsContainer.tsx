import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { provider as ProviderType } from 'web3-core'
import { getAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'
import { Button, Flex, Text } from 'archerswap-uikit'
import { Vault } from 'state/types'
import { useVaultFromSymbol, useVaultUser } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import useWeb3 from 'hooks/useWeb3'
import { useApproveVault } from 'hooks/useApprove'
import UnlockButton from 'components/UnlockButton'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
const StyledUnlockButton = styled(UnlockButton)`
  color: #000000;
  width: 100%;
  border-radius: 7px;
`
const StyledButton = styled(Button)`
  color: #000000;
`

export interface VaultWithStakedValue extends Vault {
  apy?: number
}

interface VaultCardActionsProps {
  vault: VaultWithStakedValue
  provider?: ProviderType
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<VaultCardActionsProps> = ({ vault, account, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = useVaultFromSymbol(vault.lpSymbol)
  const { allowance, tokenBalance, stakedBalance, earnings } = useVaultUser(pid, vault.provider)
  let lpAddress = getAddress(lpAddresses)

  if (vault.isSingle) {
    lpAddress = vault.token.address[process.env.REACT_APP_CHAIN_ID]
  }
  const lpName = vault.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const web3 = useWeb3()

  const lpContract = getBep20Contract(lpAddress, web3)

  const { onApprove } = useApproveVault(lpContract, getAddress(vault.vaultAddresses))

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
        vault={vault}
      />
    ) : (
      <StyledButton mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Approve Contract')}
      </StyledButton>
    )
  }

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useVaultFromSymbol? */}
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Deposited + Earned')}
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} {...vault} />
      <Flex>
        {/* <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="3px">
          {lpName}
        </Text> */}
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Your wallet balance available')}
        </Text>
      </Flex>
      {!account ? <StyledUnlockButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
