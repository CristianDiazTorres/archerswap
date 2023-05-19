/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'

import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { getBalanceBigNumber, getMultifyBigNumber } from 'utils/formatBalance'
import useTokenBalance, { useTokenAllowance, useApprove, useTokenBalanceFromChain } from 'hooks/useTokenBalance'
import { useAnySwapOutUnderlying } from 'hooks/useAnyswapV5Router'
import { HelpIcon, useWalletModal, Input as UIKitInput, useModal, Button as ThemeButton } from 'archerswap-uikit'
import useAuth from 'hooks/useAuth'
import Banner from 'components/Banner'
import { useTranslation } from 'contexts/Localization'
import Select, { OptionProps } from 'components/Bridge/Select/Select'
import TokenModal from 'components/Bridge/TokenModal'
import SwapIcon from '../../components/Svg/Swap'
import 'react-multi-carousel/lib/styles.css'
import Tooltip from '../Farms/components/Tooltip/Tooltip'
import chains from './chain.json'

const Background = styled.div<any>`
  width: 100%;
`
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  margin: 15px 0px;
  padding: 30px 40px;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`
const Button = styled(ThemeButton)<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 52px;
  border-radius: 8px;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  cursor: ${(props) => (props.active ? 'pointer' : 'not-allowed')};
`
const Powered = styled.div`
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #999999;
`

const ChainsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`
const ChainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ChainTitle = styled.div<any>`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${({ isDark }) => (isDark ? '#fff' : '#2A4AA6')};
`
const ChainImg = styled.img`
  margin-top: 25px;
  margin-bottom: 31px;
  @media (max-width: 767px) {
    width: 50px;
  }
`
const CoinContainer = styled.div`
  background: ${({ theme }) => theme.colors.input};
  border-radius: 7px;
  margin-top: 24px;
  padding: 16px;
  & .balance {
    text-align: right;
  }
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
  border: 0px solid;
  background: transparent;
  text-align: right;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  width: 100%;
  margin-right: -20px;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  :focus-visible {
    border: none;
  }
`
const SubCoinContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CoinSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background: #efefef;
  cursor: pointer;
  border-radius: 8px;
  gap: 16px;
  max-width: 200px;
  padding: 16px;
`
const CoinSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  gap: 5px;
  height: 48px;
  left: 599px;
  top: 640px;
  background: #efefef;
  cursor: pointer;
  border-radius: 8px;
  & img {
    width: 30px;
    height: 30px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    gap: 16px;
  }
`
const DescContainer = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
`
const SwapContainer = styled.div`
  max-width: 46px;
  transform: rotate(90deg);
  ${({ theme }) => theme.mediaQueries.md} {
    transform: none;
  }
`
const DescSubContainer = styled.div<{ valid: boolean; min?: boolean }>`
  display: flex;
  justify-content: space-between;
  color: ${({ valid, min }) => (valid ? '#000' : min ? '#2A4AA6' : '#F00')};
`
const StyledPage = styled(Page)`
  min-height: calc(100vh - 300px);
`
const DescInfo = styled.div`
  color: rgba(153, 153, 153, 1);
`
const BalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  margin-left: auto;
  margin-bottom: 4px;
`

const ButtonsContainer = styled.div`
  gap: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  margin-top: 24px;
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    gap: 12px;
  }
`
const InputContainer = styled.div`
  border-radius: 8px;
  padding: 16px;
  width: 100%;
`
const StyledThemeButton = styled(ThemeButton)`
  height: 30px;
  padding: 0 8px;
  background-color: rgba(231, 249, 247, 1);
  color: rgba(5, 94, 86, 1);
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 21px;
  }
`

const Bridge: React.FC = () => {
  const { isDark } = useTheme()
  const { t } = useTranslation()

  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  const { account, chainId } = useWeb3React()
  const { onApprove, approvePending } = useApprove()

  const [validAmount, setValidAmount] = useState<boolean>(true)
  const [isLargeThanMin, setIsLargeThanMin] = useState<boolean>(false)
  const [isSmallThanMax, setIsSmallThanMax] = useState<boolean>(false)

  const [txhash, setTxhash] = useState<any>()
  const [bridgeAmount, setBridgeAmount] = useState<string>()
  const [needApprove, setNeedApprove] = useState<boolean>(false)

  const [fromChain, setFromChain] = useState<OptionProps>(chains[0])
  const [toChain, setToChain] = useState<OptionProps>(chains[1])

  const [selectedToken, setSelectedToken] = useState<any>()
  const [serverData, setServerData] = useState<any[]>()

  const allowance = useTokenAllowance(selectedToken?.originUnderlying.address, selectedToken?.router)
  const tokenBalance = useTokenBalance(selectedToken?.originUnderlying.address)
  const tokenBalanceTo = useTokenBalanceFromChain(selectedToken?.underlying.address, toChain.chainId)

  const { onAnySwapOutUnderlying, pending } = useAnySwapOutUnderlying(selectedToken?.router, setTxhash)

  const [onPresentChainModal] = useModal(<TokenModal serverData={serverData} setSelectedToken={setSelectedToken} />)
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (txhash) {
      axios.get(`https://bridgeapi.anyswap.exchange/v2/history/details?params=${txhash}`).then((response: any) => {
        if (response.data.msg === 'Success') {
          clearInterval(interval)
          setTxhash(null)
        }
      })
      const interval = setInterval(async () => {
        axios.get(`https://bridgeapi.anyswap.exchange/v2/history/details?params=${txhash}`).then((response: any) => {
          if (response.data.msg === 'Success') {
            clearInterval(interval)
            setTxhash(null)
          }
        })
      }, 1000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txhash])

  useEffect(() => {
    if (new BigNumber(bridgeAmount).gt(new BigNumber(0)) && allowance.lt(new BigNumber(bridgeAmount))) {
      setNeedApprove(true)
    } else {
      setNeedApprove(false)
    }
  }, [allowance, bridgeAmount])

  useEffect(() => {
    if (new BigNumber(bridgeAmount).gt(0) && tokenBalance.gte(new BigNumber(bridgeAmount))) {
      setValidAmount(true)
    } else {
      setValidAmount(false)
    }
  }, [tokenBalance, bridgeAmount])

  useEffect(() => {
    if (selectedToken && bridgeAmount) {
      if (new BigNumber(bridgeAmount).gte(new BigNumber(selectedToken.MinimumSwap))) {
        setIsLargeThanMin(true)
      } else {
        setIsLargeThanMin(false)
      }
      if (new BigNumber(bridgeAmount).lte(new BigNumber(selectedToken.MaximumSwap))) {
        setIsSmallThanMax(true)
      } else {
        setIsSmallThanMax(false)
      }
    }
  }, [bridgeAmount, selectedToken])

  useEffect(() => {
    const changeNetwork = async () => {
      const provider = (window as WindowChain).ethereum
      if (provider) {
        const _chainId = parseInt(fromChain.chainId, 10)
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: `0x${_chainId.toString(16)}`,
              },
            ],
          })
          // await provider.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [
          //     {
          //       chainId: `0x${chainId.toString(16)}`,
          //       rpcUrls: [fromChain.rpc],
          //     },
          //   ],
          // })
          return true
        } catch (error) {
          console.error(error)
          return false
        }
      } else {
        console.error("Can't setup the Core Chain on metamask because window.ethereum is undefined")
        return false
      }
    }

    changeNetwork()
  }, [fromChain])

  useEffect(() => {
    if (toChain) {
      const fetchData = async () => {
        const response = await axios.get<any>(
          `https://bridgeapi.anyswap.exchange/v3/serverinfoV3?chainId=${fromChain.chainId}&version=STABLEV3`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response && response.status) {
          const resultArray: any[] = Object.keys(response.data).map((personNamedIndex) => {
            const person = response.data[personNamedIndex]
            // do something with person
            return person
          })

          const tempServerData: any[] = []
          for (let i = 0; i < resultArray.length; i++) {
            if (
              resultArray[i].destChains[toChain.chainId] &&
              resultArray[i].destChains[toChain.chainId].underlying &&
              resultArray[i].underlying
            ) {
              tempServerData.push({
                ...resultArray[i].destChains[toChain.chainId],
                router: resultArray[i].router,
                logoUrl: resultArray[i].logoUrl,
                originAddress: resultArray[i].address,
                originUnderlying: resultArray[i].underlying,
                originAnyToken: resultArray[i].anyToken,
              })
            }
          }
          setServerData(tempServerData)
        }
      }

      fetchData()
    }
  }, [toChain, fromChain])

  const handlePercetajeButtons = (p: number) => {
    setBridgeAmount(
      getBalanceBigNumber(
        tokenBalance.multipliedBy(new BigNumber(p)),
        selectedToken.originUnderlying.decimals,
      ).toString(),
    )
  }

  const onSendETH = async () => {
    const amount: BigNumber = getMultifyBigNumber(new BigNumber(bridgeAmount), selectedToken.originUnderlying.decimals)

    if (!selectedToken || bridgeAmount === '' || amount.gt(tokenBalance)) {
      return
    }
    // console.log('Send to router ============>')
    // console.log('Router contract: ', selectedToken.originAnyToken.address)
    // console.log('Amount: ', amount.dp(0).toString(10))
    // console.log('From -> to: ', fromChain.label, toChain.label)
    onAnySwapOutUnderlying(selectedToken.originAnyToken.address, account, amount.dp(0).toString(10), toChain.chainId)
  }

  return (
    <Background isDark={isDark}>
      <Banner
        src="/images/assets/banners/bridge_banner.png"
        mobileSrc="/images/assets/banners/mobile_bridge_banner.png"
        alt="bridge_banner"
        title="Bridge"
        text="Bridge your tokens with no additional fees"
      />
      <StyledPage>
        <Container>
          <CardContainer>
            <ChainsContainer>
              <ChainContainer>
                <ChainTitle isDark={isDark}>From Chain</ChainTitle>
                <ChainImg src={fromChain.image} alt="from" />
                <Select
                  options={chains}
                  selectedValue={fromChain}
                  onChange={(value) => {
                    setBridgeAmount('0')
                    setSelectedToken(null)
                    if (value === toChain) {
                      setToChain(fromChain)
                    }
                    setFromChain(value)
                  }}
                />
              </ChainContainer>
              <SwapContainer>
                <SwapIcon />
              </SwapContainer>
              <ChainContainer>
                <ChainTitle isDark={isDark}>To Chain</ChainTitle>
                <ChainImg src={toChain.image} alt="from" />
                <Select
                  options={chains}
                  selectedValue={toChain}
                  onChange={(value) => {
                    setBridgeAmount('0')
                    setSelectedToken(null)
                    if (value === fromChain) {
                      setFromChain(toChain)
                    }
                    setToChain(value)
                  }}
                />
              </ChainContainer>
            </ChainsContainer>
            <CoinContainer>
              <SubCoinContainer>
                {selectedToken ? (
                  <CoinSelected
                    onClick={() => {
                      if (chainId.toString() === fromChain.chainId) {
                        onPresentChainModal()
                      }
                    }}
                  >
                    <img src={selectedToken.logoUrl} alt="dwon" />
                    <div>{selectedToken.originUnderlying.symbol}</div>
                  </CoinSelected>
                ) : (
                  <CoinSelect
                    onClick={() => {
                      if (chainId && chainId.toString() === fromChain.chainId) {
                        onPresentChainModal()
                      }
                    }}
                  >
                    <p>Select a currency</p>
                    <img src="/images/assets/icon/down.png" alt="down" />
                  </CoinSelect>
                )}
                <InputContainer>
                  <Input
                    value={bridgeAmount}
                    maxLength={18}
                    type="number"
                    placeholder="0.0"
                    onChange={(e: any) => {
                      const { value } = e.target
                      setBridgeAmount(value)
                    }}
                  />
                </InputContainer>
              </SubCoinContainer>

              {selectedToken && (
                <div>
                  <ButtonsContainer>
                    <StyledThemeButton
                      variant="tertiary"
                      onClick={() => {
                        handlePercetajeButtons(0.25)
                      }}
                    >
                      25%
                    </StyledThemeButton>
                    <StyledThemeButton
                      variant="tertiary"
                      onClick={() => {
                        handlePercetajeButtons(0.5)
                      }}
                    >
                      50%
                    </StyledThemeButton>
                    <StyledThemeButton
                      variant="tertiary"
                      onClick={() => {
                        handlePercetajeButtons(0.75)
                      }}
                    >
                      75%
                    </StyledThemeButton>
                    <StyledThemeButton
                      variant="tertiary"
                      onClick={() => {
                        handlePercetajeButtons(1)
                      }}
                    >
                      100%
                    </StyledThemeButton>
                  </ButtonsContainer>
                  <BalanceContainer className="balance">
                    <p>Balance on {fromChain.label}: </p>
                    <p>{getBalanceBigNumber(tokenBalance, selectedToken.originUnderlying.decimals).toFormat(3)}</p>
                  </BalanceContainer>
                  <BalanceContainer className="balance">
                    <p>Balance on {toChain.label}: </p>
                    <p>{getBalanceBigNumber(tokenBalanceTo, selectedToken.underlying.decimals).toFormat(3)}</p>
                  </BalanceContainer>
                </div>
              )}
            </CoinContainer>

            <ButtonContainer>
              {!account ? (
                <Button
                  active
                  onClick={() => {
                    onPresentConnectModal()
                  }}
                >
                  {t('Connect Wallet')}
                </Button>
              ) : needApprove ? (
                <Button
                  active={!approvePending && selectedToken}
                  variant={selectedToken ? 'primary' : 'disabled'}
                  onClick={() => {
                    if (selectedToken) {
                      onApprove(selectedToken.router, selectedToken.originUnderlying.address)
                    }
                  }}
                >
                  {approvePending ? 'Pending...' : 'Approve'}
                </Button>
              ) : (
                <Button
                  active={validAmount && !!selectedToken && isLargeThanMin && isSmallThanMax}
                  onClick={() => {
                    if (validAmount && !!selectedToken && isLargeThanMin && isSmallThanMax) {
                      onSendETH()
                    }
                  }}
                  variant={validAmount && !!selectedToken && isLargeThanMin && isSmallThanMax ? 'primary' : 'disabled'}
                >
                  {pending ? 'Pending...' : 'Confirm'}
                </Button>
              )}
            </ButtonContainer>
            <Powered>Powered by Multichain Network</Powered>
            <div />
          </CardContainer>
          {selectedToken && (
            <DescContainer>
              {/* <DescSubContainer
                  valid={isLargeThanMin}
                >
                  <div>Current Bridgeable Range</div>
                  <div>
                    {new BigNumber(selectedToken.MinimumSwap).toFormat(3)}-Pool Balance {selectedToken.underlying.symbol}
                  </div>
                </DescSubContainer> */}
              <DescSubContainer valid={isSmallThanMax}>
                <div>Max Bridge Amount</div>
                <div>
                  {new BigNumber(selectedToken.MaximumSwap).toFormat(3)} {selectedToken.originUnderlying.symbol}
                </div>
              </DescSubContainer>
              <DescSubContainer valid={isLargeThanMin} min>
                <div>Min Bridge Amount</div>
                <div>
                  {new BigNumber(selectedToken.MinimumSwap).gte(0.001)
                    ? new BigNumber(selectedToken.MinimumSwap).toFormat(3)
                    : new BigNumber(selectedToken.MinimumSwap).toFormat(4)}{' '}
                  {selectedToken.originUnderlying.symbol}
                </div>
              </DescSubContainer>
              <DescSubContainer valid>
                <div style={{ display: 'flex' }}>
                  <div>{'Minimum Fee '}</div>
                  <Tooltip
                    content={`Fee of 0.001 with a minimum fee of ${selectedToken.originUnderlying.symbol} and a maximum fee of 1,000 ${selectedToken.originUnderlying.symbol}. The fee is charged by Multichain, ArcherSwap charges no additional fee.`}
                  >
                    <HelpIcon color="textSubtle" />
                  </Tooltip>
                </div>
                <div>
                  {new BigNumber(selectedToken.MinimumSwapFee).gte(0.001)
                    ? new BigNumber(selectedToken.MinimumSwapFee).toFormat(3)
                    : new BigNumber(selectedToken.MinimumSwapFee).toFormat(5)}{' '}
                  {selectedToken.originUnderlying.symbol}
                </div>
              </DescSubContainer>
              <DescSubContainer valid>
                <DescInfo>
                  Amounts greater than {new BigNumber(selectedToken.BigValueThreshold).toFormat(0)}{' '}
                  {selectedToken.originUnderlying.symbol} could take up to 12 hours
                </DescInfo>
              </DescSubContainer>
            </DescContainer>
          )}
        </Container>
      </StyledPage>
    </Background>
  )
}

export default Bridge
