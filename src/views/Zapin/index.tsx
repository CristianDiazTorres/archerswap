import React, { useState } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, Input } from 'archerswap-uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Dropdown, Spinner } from 'react-bootstrap'
import { AutoColumn } from 'components/Column'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween } from 'components/Row'
import { ArrowWrapper, BottomGrouping, Wrapper } from 'components/swap/styleds'

import useI18n from 'hooks/useI18n'
import useGetApiPrices from 'hooks/useGetApiPrices'
import useBalanceFromAddress from 'hooks/useBalanceFromAddress'
import useCreateLpToken from 'hooks/useCreateLp'
import PageHeader from 'components/PageHeader'
import lpContracts from 'constants/lpToken/index.json'
import AppBody from '../AppBody'

const CreateLpSelect = styled.div`
  width: 100%;

  img {
    width: 32px;
    margin-right: 4px;
  }

  .dropdown {
    width: 100%;
    button {
      width: 100%;
      border: ${({ theme }) => theme.colors.invertedContrast} !important;
      background-color: ${({ theme }) => theme.colors.input} !important;
      box-shadow: ${({ theme }) => theme.shadows.inset};
      display: flex;
      align-items: center;
      justify-content: space-between;

      &::after {
        color: ${({ theme }) => theme.colors.text};
      }
    }
    .create-lp-select-item {
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.text};
    }
    .dropdown-menu {
      width: 100% !important;
      height: 200px;
      overflow: auto;
      background-color: ${({ theme }) => theme.colors.invertedContrast};
      .dropdown-item {
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }
`
const CoinPair = styled.div`
  img {
    border-radius: 50%;
  }
  img:nth-child(2) {
    margin-left: -16px;
  }
`

const Field = styled.div`
  align-items: center;
  display: inline-flex;

  & > ${Text} {
    cursor: pointer;
    margin-left: 8px;
  }
`

const ZERO = '0x0000000000000000000000000000000000000000'

const Zapin = () => {
  const TranslateString = useI18n()

  const [lpTokenSymbol, setLpTokenSymbol] = useState('usdc-core')
  const [baseTokenBalance, setBaseTokenBalance] = useState('')

  const tokenBalance = useBalanceFromAddress(null)
  const lpTokenBalance = useBalanceFromAddress(
    lpContracts.archerswap[lpTokenSymbol]
      ? lpContracts.archerswap[lpTokenSymbol].lpAddresses
      : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].lpAddresses
  )
  const prices: any = useGetApiPrices()
  const routerAddress = '0x74f56a7560ef0c72cf6d677e3f5f51c2d579ff15'

  const receiveAmount = prices[lpTokenSymbol]
    ? new BigNumber(prices.wcore || 0).times(baseTokenBalance || 0).div(prices[lpTokenSymbol])
    : new BigNumber(0)

  const { onCreateLp, pending } = useCreateLpToken({
    payableAmount: new BigNumber(baseTokenBalance || 0).times(10 ** 18).toString(10),
    _fromTokenAddress: ZERO,
    _amountIn: 0,
    _lpAddress: lpContracts.archerswap[lpTokenSymbol]
      ? lpContracts.archerswap[lpTokenSymbol].lpAddresses
      : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].lpAddresses,
    _token0Path: lpContracts.archerswap[lpTokenSymbol]
      ? lpContracts.archerswap[lpTokenSymbol].token0Path
      : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].token0Path,
    _token1Path: lpContracts.archerswap[lpTokenSymbol]
      ? lpContracts.archerswap[lpTokenSymbol].token1Path
      : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].token1Path,
    _minPoolTokens: receiveAmount
      .times(0.9)
      .times(10 ** 18)
      .dp(0, 0)
      .toNumber(),
    _token0RouterAddress: routerAddress,
    _token1RouterAddress: routerAddress,
    _LPRouterAddress: routerAddress,
  })

  const handleCreateLp = async () => {
    onCreateLp()
  }
  return (
    <>
      <CardNav activeIndex={2} />
      <AppBody>
        <Wrapper id="swap-page">
          <PageHeader
            title={TranslateString(90, 'Create LP')}
            description={TranslateString(91, 'One Click LP Creator')}
            isShowSetting={false}
          />
          <CardBody>
            <AutoColumn gap="md">
              <CreateLpSelect>
                <Dropdown>
                  <Dropdown.Toggle className="create-lp-select-toggle">
                    <div className="create-lp-select-item">
                      <img src="/images/coins/core.png" alt="" />
                      <p>CORE</p>
                      <img className="ml-auto" src="/assets/images/chevron-down.svg" alt="" />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="create-lp-menu">
                    <Dropdown.Item>
                      <div className="create-lp-select-item">
                        <img src="/images/coins/core.png" alt="" />
                        <p>CORE</p>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </CreateLpSelect>
              <Field>
                <Input
                  type="number"
                  value={baseTokenBalance}
                  step="any"
                  placeholder="0"
                  onChange={(e: any) => setBaseTokenBalance(e.target.value.toString())}
                />
                <Text onClick={() => setBaseTokenBalance(new BigNumber(tokenBalance).div(10 ** 18).toString(10))}>
                  MAX
                </Text>
              </Field>
              <div className="create-lp-balance" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Balance</p>
                <p>{tokenBalance.div(10 ** 18).toString(10)}</p>
              </div>
              <AutoColumn justify="space-between">
                <AutoRow justify="center" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <IconButton variant="tertiary" style={{ borderRadius: '50%' }} scale="sm">
                      <ArrowDownIcon color="primary" width="24px" />
                    </IconButton>
                  </ArrowWrapper>
                </AutoRow>
              </AutoColumn>
              <CreateLpSelect>
                <Dropdown>
                  <Dropdown.Toggle className="create-lp-select-toggle">
                    <div className="create-lp-select-item">
                      <CoinPair>
                        <img
                          src={
                            lpContracts.archerswap[lpTokenSymbol]
                              ? lpContracts.archerswap[lpTokenSymbol].asset1
                              : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].asset1
                          }
                          alt="token"
                        />
                        <img
                          src={
                            lpContracts.archerswap[lpTokenSymbol]
                              ? lpContracts.archerswap[lpTokenSymbol].asset2
                              : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].asset2
                          }
                          alt="token"
                        />
                      </CoinPair>
                      <p>
                        {lpContracts.archerswap[lpTokenSymbol]
                          ? lpContracts.archerswap[lpTokenSymbol].lpSymbol
                          : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].lpSymbol}
                      </p>
                      <img className="ml-auto" src="/assets/images/chevron-down.svg" alt="" />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="create-lp-menu">
                    {Object.keys(lpContracts.archerswap).map((key) => (
                      <Dropdown.Item key={key} onClick={() => setLpTokenSymbol(key)}>
                        <div className="create-lp-select-item">
                          <CoinPair>
                            <img
                              src={
                                lpContracts.archerswap[key]
                                  ? lpContracts.archerswap[key].asset1
                                  : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].asset1
                              }
                              alt="token"
                            />
                            <img
                              src={
                                lpContracts.archerswap[key]
                                  ? lpContracts.archerswap[key].asset2
                                  : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].asset2
                              }
                              alt="token"
                            />
                          </CoinPair>
                          <p>{lpContracts.archerswap[key].lpSymbol}</p>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </CreateLpSelect>
              <RowBetween align="center">
                <Text fontSize="14px">Balance</Text>
                <Text fontSize="14px">{(lpTokenBalance || new BigNumber(0)).div(10 ** 18).toString(10)}</Text>
              </RowBetween>
              <RowBetween align="center">
                <Text fontWeight="bold" fontSize="14px">
                  You Receive
                </Text>
                <Text fontWeight="bold" fontSize="14px">
                  <p>≈ {receiveAmount.toString(10)} LP</p>
                </Text>
              </RowBetween>
              <RowBetween align="center">
                <Text fontSize="14px">Slippage Tolerance</Text>
                <Text fontSize="14px">10.00%</Text>
              </RowBetween>
              <RowBetween align="center">
                <Text fontSize="14px">Min.Received</Text>
                <Text fontSize="14px">{receiveAmount.times(0.9).toString(10)} LP</Text>
              </RowBetween>
            </AutoColumn>
            <BottomGrouping>
              <Button
                disabled={
                  pending ||
                  !baseTokenBalance ||
                  new BigNumber(baseTokenBalance).isGreaterThan(new BigNumber(tokenBalance).div(10 ** 18))
                }
                width="100%"
                onClick={handleCreateLp}
              >
                {pending && <Spinner animation="border" size="sm" style={{ marginRight: 5 }} />}
                Get{' '}
                {lpContracts.archerswap[lpTokenSymbol]
                  ? lpContracts.archerswap[lpTokenSymbol].lpSymbol
                  : lpContracts.archerswap[Object.keys(lpContracts.archerswap)[0]].lpSymbol}{' '}
                LP
              </Button>
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
    </>
  )
}

export default Zapin
