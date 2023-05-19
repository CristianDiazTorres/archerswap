import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text } from 'archerswap-uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useValuts, usePriceBowUsd, useGetApiPrices } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import useWeb3 from 'hooks/useWeb3'
import { fetchVaultUserDataAsync } from 'state/actions'
import { Vault } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getVaultApy } from 'utils/apy'
import { orderBy } from 'lodash'
// import { START_TIMESTAMP } from 'config'

import VaultCard, { VaultWithStakedValue } from './components/VaultCard/VaultCard'
import Table from './components/VaultTable/VaultTable'
import VaultTabButtons from './components/VaultTabButtons'
import SearchInput from './components/SearchInput'
import { RowProps } from './components/VaultTable/Row'
// import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema, ViewMode } from './components/types'
import Select, { OptionProps } from './components/Select/Select'
import JetVault from './components/JetVault'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > div {
    max-width: 136px;
    min-width: unset;

    > div {
      width: 100%;
    }
  }
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const Header = styled.div`
  padding: 32px 0px;
  background: ${({ theme }) => theme.colors.farming};

  display: block;
  padding-left: 16px;
  padding-right: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 0 0 8.5%;
    min-height: 190px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    justify-content: center;
  }
`

const Container = styled.div``
const Container2 = styled.div`
  display: flex;
  justify-content: center;
`
const Background = styled.div`
  width: 100%;
  background-image: url('/images/assets/bgf.svg');
  background-repeat: no-repeat;
  background-position: top 80px right;
`
// const NotifyContainer = styled.div`
//   border: 1px solid #fec803;
//   border-radius: 8px;
//   padding: 8px 16px;
//   margin-bottom: 16px;
// `

const Vaults: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const vaultsLP = useValuts()
  const bowPrice = usePriceBowUsd()
  const [query, setQuery] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState(ViewMode.TABLE)
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const [sortOption, setSortOption] = useState(t('hot'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [providerOption, setProviderOption] = useState('All')
  const prices = useGetApiPrices()

  // const { blockNumber } = useBlock()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchVaultUserDataAsync(account, web3))
    }
  }, [account, web3, dispatch, fastRefresh])
  const [stackedOnly, setStackedOnly] = useState(false)

  const calculateAPY = (vault) => {
    const quoteTokenPriceUsd = prices[vault.quoteToken.symbol.toLowerCase()]
    const totalFarmLiquidity = new BigNumber(vault.lpTotalMcInQuoteToken).times(quoteTokenPriceUsd)
    const rewardPrice = bowPrice
    const apy = getVaultApy(vault.poolWeight, rewardPrice, totalFarmLiquidity)
    return apy
  }

  const activeVaults = vaultsLP.filter((vault) => calculateAPY(vault) !== 0)
  const inactiveVaults = vaultsLP.filter((vault) => calculateAPY(vault) === 0)

  const stackedOnlyVaults = activeVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const sortVaults = (vaults: VaultWithStakedValue[]): VaultWithStakedValue[] => {
    switch (sortOption) {
      case 'apr':
        return orderBy(vaults, 'apy', 'desc')
      // case 'multiplier':
      //   return orderBy(
      //     vaults,
      //     (vault: VaultWithStakedValue) => (vault.multiplier ? Number(vault.multiplier.slice(0, -1)) : 0),
      //     'desc',
      //   )
      case 'earned':
        return orderBy(vaults, (vault: VaultWithStakedValue) => (vault.userData ? vault.userData.earnings : 0), 'desc')
      case 'liquidity':
        return orderBy(vaults, (vault: VaultWithStakedValue) => Number(vault.liquidity), 'desc')
      default:
        return vaults
    }
  }

  const vaultsList = useCallback(
    (vaultsToDisplay: Vault[]): VaultWithStakedValue[] => {
      let vaultsToDisplayWithAPY: VaultWithStakedValue[] = vaultsToDisplay.map((vault) => {
        if (!vault.lpTotalMcInQuoteToken || !prices) {
          return vault
        }

        const quoteTokenPriceUsd = prices[vault.quoteToken.symbol.toLowerCase()]
        let totalFarmLiquidity = new BigNumber(vault.lpTotalMcInQuoteToken).times(quoteTokenPriceUsd)
        let totalLiquidity = new BigNumber(vault.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
        const lpPrice = new BigNumber(totalLiquidity).div(vault.vaultBalance)
        if (vault.lpSymbol === 'BOW') {
          totalLiquidity = new BigNumber(vault.vaultBalance).times(prices[vault.lpSymbol.toLowerCase()])
          totalFarmLiquidity = new BigNumber(vault.tokenBalanceMC).times(prices[vault.lpSymbol.toLowerCase()])
        }
        const rewardPrice = prices.bow
        const apy = getVaultApy(vault.poolWeight, rewardPrice, totalFarmLiquidity, vault.provider)
        return { ...vault, apy, liquidity: totalLiquidity, lpPrice }
      })

      if (query) {
        const lowercaseQuery = query.toLowerCase()
        vaultsToDisplayWithAPY = vaultsToDisplayWithAPY.filter((vault: VaultWithStakedValue) => {
          if (vault.lpSymbol.toLowerCase().includes(lowercaseQuery)) {
            return true
          }

          return false
        })
      }
      return vaultsToDisplayWithAPY
    },
    [prices, query],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const isActive = !pathname.includes('history')
  let vaultsStaked = []
  if (isActive) {
    vaultsStaked = stackedOnly ? vaultsList(stackedOnlyVaults) : vaultsList(activeVaults)
  } else {
    vaultsStaked = vaultsList(inactiveVaults)
  }

  vaultsStaked = sortVaults(vaultsStaked)
  vaultsStaked = vaultsStaked.filter((v) => providerOption === 'All' || v.provider === providerOption)
  const rowData = vaultsStaked.map((vault) => {
    const { quoteToken, token } = vault
    const lpLabel = vault.lpSymbol && vault.lpSymbol.split(' ')[0].toUpperCase().replace('ARCHER', '')
    const rewardPrice = bowPrice
    const row: RowProps = {
      apr: {
        value: vault.apy && vault.apy.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        // multiplier: vault.multiplier,
        lpLabel,
        quoteTokenAdresses: quoteToken.address,
        quoteTokenSymbol: quoteToken.symbol,
        tokenAddresses: token.address,
        cakePrice: rewardPrice,
        originalValue: vault.apy,
      },
      farm: {
        image: vault.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: vault.pid,
        provider: vault.provider,
      },
      earned: {
        earnings: vault.userData ? getBalanceNumber(new BigNumber(vault.userData.earnings)) : null,
        pid: vault.pid,
      },
      liquidity: {
        liquidity: vault.liquidity,
      },
      multiplier: {
        multiplier: vault.provider,
      },
      details: vault,
    }

    return row
  })
  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} columns={columns} />
    }
    return (
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {vaultsStaked.map((vault) => (
              <VaultCard key={vault.pid} vault={vault} bowPrice={bowPrice} account={account} removed={false} />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {vaultsStaked.map((vault) => (
              <VaultCard key={vault.pid} vault={vault} bowPrice={bowPrice} account={account} removed />
            ))}
          </Route>
        </FlexLayout>
      </div>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  // const handleFilterProviderChange = (option: OptionProps): void => {
  //   setProviderOption(option.value)
  // }

  return (
    <>
      <Header>
        <Container>
          <Heading as="h1" size="xxl" color="secondary" mb="24px">
            {t('Vaults')}
          </Heading>
          <Heading size="lg" color="text">
            {t(
              'Deposit LP or single tokens to automatically grow your deposits. There is a 0.5% withdrawal fee on all vaults.',
            )}
          </Heading>
        </Container>
        <Container2>
          <JetVault />
        </Container2>
      </Header>

      <Background>
        <Page>
          {/* {blockNumber !== 0 && blockNumber <= START_TIMESTAMP && (
            <NotifyContainer>
              <Heading as="h1" size="xl" color="secondary" mb="24px">
                {t('Bow Farming Countdown')}
              </Heading>
              <Flex alignItems="center" justifyContent="space-between" mb="8px">
                <Text fontSize="20px">{t(`BOW Farming Starts On Block ${START_TIMESTAMP}`)}</Text>
                <Text fontSize="20px">{`${START_TIMESTAMP - blockNumber} blocks left until BOW Farming`}</Text>
              </Flex>
            </NotifyContainer>
          )} */}
          <ControlContainer>
            <ViewControls>
              {/* <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} /> */}
              <ToggleWrapper>
                <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} scale="sm" />
                <Text> {t('Staked only')}</Text>
              </ToggleWrapper>
              <VaultTabButtons />
            </ViewControls>
            <FilterContainer>
              <LabelWrapper style={{ marginRight: 16 }}>
                <Text>{t('Sort by')}</Text>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APY'),
                      value: 'apr',
                    },
                    {
                      label: t('Deposited + Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Liquidity'),
                      value: 'liquidity',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </LabelWrapper>
              {/* <LabelWrapper>
                <Text>{t('Filter by')}</Text>
                <Select
                  options={[
                    {
                      label: 'All',
                      value: 'All',
                    },
                    {
                      label: 'Archerswap',
                      value: 'Archerswap',
                    },
                  ]}
                  onChange={handleFilterProviderChange}
                />
              </LabelWrapper> */}
              <LabelWrapper style={{ marginLeft: 16 }}>
                <Text>{t('Search')}</Text>
                <SearchInput onChange={handleChangeQuery} value={query} />
              </LabelWrapper>
            </FilterContainer>
          </ControlContainer>
          {renderContent()}
          <StyledImage src="/images/assets/farmjet.svg" alt="Archerswap illustration" width={120} height={103} />
        </Page>
      </Background>
    </>
  )
}

export default Vaults
