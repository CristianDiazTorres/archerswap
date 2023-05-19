import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Button, Flex, Text } from 'archerswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import useTheme from 'hooks/useTheme'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

const StyledFarmStakingCard = styled(Card)<any>`
  background: ${({ theme, isDark }) => (isDark ? theme.card.background : '#fff')};
  box-shadow: ${({ theme, isDark }) =>
    isDark ? '0px 3.5px 10px rgba(134, 145, 172, 0.1)' : '0px 3.5px 10px rgba(10, 14, 22, 0.1)'};
  border-radius: 0px;
  border: ${({ theme, isDark }) => (isDark ? '1px solid #29292D' : '0px solid')};
`
const StyledUnlockButton = styled(UnlockButton)`
  color: #000000;
  width: 100%;
  margin-top: 20px;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
`

const LeftBlock = styled.div`
  .bow {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }
`

const RightBlock = styled.div`
  text-align: right;
  .bow {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }
`

const StyledButton = styled(Button)`
  border-radius: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.title};
  font-size: 14px;
`

const Actions = styled.div``

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { isDark } = useTheme()

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard isDark={isDark}>
      <CardBody>
        <Flex justifyContent="space-between">
          <LeftBlock>
            <Text fontSize="16px" color="#BA6401" className='bow'>
              {t('BOW to Harvest')}
            </Text>
            <CakeHarvestBalance />
          </LeftBlock>

          <RightBlock>
            <Text fontSize="16px" color="#BA6401" className='bow'>
              {t('BOW in Wallet')}
            </Text>
            <CakeWalletBalance />
          </RightBlock>
        </Flex>
        <Actions>
          {account ? (
            <StyledButton
              id="harvest-all"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              width="100%"
            >
              {pendingTx
                ? t('Collecting Bow')
                : t(`Harvest all (%count%)`, {
                    count: balancesWithValue.length,
                  })}
            </StyledButton>
          ) : (
            <StyledUnlockButton width="100%" />
          )}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
