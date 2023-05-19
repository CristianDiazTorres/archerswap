/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import { getBalanceBigNumber, getMultifyBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import useTokenBalance, {
  useETHBalance,
  useTokenAllowance,
  useApprove,
  useTokenSymbol,
  useTokenDecimal,
} from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { useMutiTransfer, useTokenMutiTransfer } from 'hooks/useMultiTransfer'
import { getMultiAddress } from 'utils/addressHelpers'
import { useWalletModal, Button } from 'archerswap-uikit'
import useAuth from 'hooks/useAuth'
import Banner from '../../components/Banner'
import 'react-multi-carousel/lib/styles.css'
import useTheme from '../../hooks/useTheme'

const Background = styled.div`
  width: 100%;
`
const Icon = styled.img``
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const Title = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  color: ${(props) => props.theme.colors.text};
  padding-top: 32px;
`
const Description = styled.div`
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text};
  padding-top: 16px;
  opacity: 0.8;
`
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
`
const TabItem = styled.div<{ active: boolean }>`
  display: flex;
  padding: 11px 57px;
  background: ${(props) => (props.active ? '#EAAA08' : props.theme.colors.tertiary)};
  border-radius: 32px;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => (props.active ? '#ffffff' : props.theme.colors.textSubtle)};
  z-index: ${(props) => (props.active ? '1' : '0')};
  margin: 32px -18px;
  cursor: pointer;
`
const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const TokenInput = styled.input`
  margin: 16px 0px;
  max-width: 800px;
  width: 100%;
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSubtle};
  background: ${(props) => props.theme.colors.tertiary};
  padding: 14px 32px;
  border: solid 1px ${(props) => props.theme.colors.borderColor};
  border-radius: 10px;
`
const InputButton = styled.div`
  background: linear-gradient(265.22deg, #ed952e 0%, #f7ce47 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 32px;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  margin: 0 10px;
  cursor: pointer;
`
const Balance = styled.div`
  text-align: center;
  font-size: 24px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.textSubtle};
  font-weight: 500;
`
const AddressInput = styled.textarea`
  margin: 16px 0px;
  max-width: 800px;
  width: 100%;
  min-height: 120px;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.theme.colors.textSubtle};
  background: ${(props) => props.theme.colors.tertiary};
  padding: 10px 15px;
  border: solid 1px ${(props) => props.theme.colors.borderColor};
  border-radius: 10px;
  &::placeholder {
    color: ${(props) => props.theme.colors.textSubtle};
  }
`
const CardContainer = styled.div`
  background: ${(props) => props.theme.colors.background};
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  margin: 15px 0px;
  padding: 32px 24px;
`
const Confirm = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  color: ${(props) => props.theme.colors.bow};
`
const TableContainer = styled.div`
  background: ${(props) => props.theme.colors.tertiary};
  border-radius: 7px;
  margin-top: 24px;
  padding: 32px 26px;
`
const TableItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0px;
`
const TableTitle = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
`
const TableContent = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: #999999;
`
const ItemContainer = styled.div`
  padding: 10px 0px;
`
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 26px;
`
const ItemTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.textDisabled};
`
const ItemTitle1 = styled.div<{ active: boolean }>`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => (props.active ? props.theme.colors.textDisabled : 'red')};
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`

const MultiTransfer: React.FC = () => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const addressLength = 43
  const [tempTokenAddress, setTempTokenAddress] = useState<string>()
  const [tokenAddress, setTokenAddress] = useState<string>()
  const { account } = useWeb3React()
  const ethBalance = useETHBalance()
  const tokenBalance = useTokenBalance(tokenAddress)
  const symbol = useTokenSymbol(tokenAddress)
  const decimal = useTokenDecimal(tokenAddress)
  const allowance = useTokenAllowance(tokenAddress, getMultiAddress())
  const { onMultiTransfer, pending } = useMutiTransfer()
  const { onTokenMultiTransfer, pendingToken } = useTokenMutiTransfer()
  const { onApprove, approvePending } = useApprove()

  const [isToken, setIsToken] = useState<boolean>(false)
  const [validAddress, setValidAddress] = useState<boolean>(false)
  const [needApprove, setNeedApprove] = useState<boolean>(false)

  const [inputedText, setInputedText] = useState<string>()
  const [addressArray, setAddressArray] = useState<string[]>([])
  const [amountArray, setAmountArray] = useState<string[]>([])
  const [totalAmount, setTotalAmount] = useState<BigNumber>(new BigNumber(0))
  const [validAmount, setValidAmount] = useState<boolean>(true)
  const { isDark } = useTheme()

  useEffect(() => {
    if (!isToken) {
      if (ethBalance.gte(totalAmount)) {
        setValidAmount(true)
      } else {
        setValidAmount(false)
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (tokenBalance.gte(totalAmount)) {
        setValidAmount(true)
      } else {
        setValidAmount(false)
      }
    }
  }, [ethBalance, totalAmount, tokenBalance, isToken])

  useEffect(() => {
    setAddressArray([])
    setAmountArray([])
    setTotalAmount(new BigNumber(0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToken])

  useEffect(() => {
    if (isToken) {
      if (totalAmount.gt(new BigNumber(0)) && allowance.lt(totalAmount)) {
        setNeedApprove(true)
      } else {
        setNeedApprove(false)
      }
    } else {
      setNeedApprove(false)
    }
  }, [allowance, totalAmount, isToken])

  useEffect(() => {
    if (inputedText) {
      const tempAddress = []
      const tempAmount = []
      let tempTAmount = new BigNumber(0)
      const arrayText = inputedText.split('\n')
      for (let i = 0; i < arrayText.length; i++) {
        const data = arrayText[i]
        if (data && data.length > addressLength) {
          const addressStartIndex = getAddressIndex(data, 0)
          const amountData = data.substring(addressStartIndex + addressLength)
          const amountStartIndex = getAmountIndex(amountData)
          const amount = amountData.substring(amountStartIndex)
          if (parseFloat(amount)) {
            tempAddress.push(data.substring(addressStartIndex, addressStartIndex + addressLength - 1))
            tempAmount.push(getMultifyBigNumber(new BigNumber(parseFloat(amount)), isToken ? decimal : 18).toString())
            tempTAmount = tempTAmount.plus(
              getMultifyBigNumber(new BigNumber(parseFloat(amount)), isToken ? decimal : 18),
            )
          }
        }
      }
      setAddressArray(tempAddress)
      setAmountArray(tempAmount)
      setTotalAmount(tempTAmount)
    } else {
      setAddressArray([])
      setAmountArray([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputedText])

  const getAddressIndex = (data: string, start: number) => {
    const startIndex = data.indexOf('0x', start)

    if (startIndex === -1) {
      return startIndex
    }
    if (startIndex + addressLength > data.length) {
      return -1
    }

    const isValidAddress = Web3.utils.isAddress(data.substring(startIndex, startIndex + addressLength - 1))
    if (isValidAddress) {
      return startIndex
    }
    return getAddressIndex(data, startIndex + 2)
  }

  const getAmountIndex = (data: string) => {
    for (let i = 0; i < data.length; i++) {
      if (data.charAt(i) >= '0' && data.charAt(i) <= '9') {
        return i
      }
    }
    return -1
  }

  const onSendETH = () => {
    if (isToken) {
      if (needApprove) {
        onApprove(getMultiAddress(), tokenAddress)
      } else {
        onTokenMultiTransfer(tokenAddress, addressArray, amountArray)
      }
    } else {
      onMultiTransfer(addressArray, amountArray, totalAmount)
    }
  }

  return (
    <Background>
      <Banner
        src="/images/assets/banners/multisender_banner.png"
        mobileSrc="/images/assets/banners/mobile_multisender_banner.png"
        alt="disperse_banner"
        title={t('Free Token Multisender')}
        text={t('Distribute CORE or tokens to multiple addresses')}
        white
      />
      <Page>
        <Container>
          <TabContainer>
            <TabItem
              active={!isToken}
              onClick={() => {
                setIsToken(false)
              }}
            >
              CORE
            </TabItem>
            <TabItem
              active={isToken}
              onClick={() => {
                setIsToken(true)
              }}
            >
              {t('Token')}
            </TabItem>
          </TabContainer>
          {isToken ? (
            <div style={{ width: '100%', maxWidth: 800 }}>
              <Title>{t('Token Address')}</Title>
              <InputContainer>
                <TokenInput
                  value={tempTokenAddress}
                  onChange={(e) => {
                    setTempTokenAddress(e.target.value)
                  }}
                />
                <InputButton
                  onClick={() => {
                    const isValidAddress = Web3.utils.isAddress(tempTokenAddress)
                    if (isValidAddress) {
                      setValidAddress(true)
                      setTokenAddress(tempTokenAddress)
                    } else {
                      setValidAddress(false)
                    }
                  }}
                >
                  {t('LOAD')}
                </InputButton>
              </InputContainer>
              {validAddress && decimal > 0 ? (
                <Balance>
                  {t('You have %balance%', {
                    balance: `${getBalanceBigNumber(tokenBalance, decimal).toFormat(
                      5,
                    )} ${symbol} (ERC 20, ${decimal}{' '}
                  Decimals)`,
                  })}
                </Balance>
              ) : (
                <Balance style={{ color: '#6E7B9B' }}>{t('Incorrect address')}</Balance>
              )}
            </div>
          ) : (
            <Balance>{t('You have %balance% CORE', { balance: getBalanceBigNumber(ethBalance).toFormat(5) })}</Balance>
          )}
          <Title>{t('Recipients and amounts')}</Title>
          <Description>
            {t('Enter one address and amounts in %symbol% on each line, supports any format.', {
              symbol: isToken ? 'Token' : 'CORE',
            })}
          </Description>

          <AddressInput
            placeholder="0xD6170A12b133005fAbCf877d636340a4B183b16585123&#10;0xD6170A12b133005fAbCf877d636340a4B183b1658-123&#10;0xD6170A12b133005fAbCf877d636340a4B183b1658=123"
            value={inputedText}
            onChange={(e) => setInputedText(e.target.value)}
          />

          <CardContainer>
            <Confirm>{t('Confirm')}</Confirm>
            <TableContainer>
              <TableItem>
                <TableTitle>{t('Address')}</TableTitle>
                <TableTitle>{t('Amount')}</TableTitle>
              </TableItem>
              {addressArray.map((address, index) => {
                return (
                  <TableItem key={index.toString()}>
                    <TableContent>{address}</TableContent>
                    <TableContent>
                      {getFullDisplayBalance(new BigNumber(amountArray[index]), isToken ? decimal : 18)}{' '}
                      {isToken ? symbol : 'CORE'}
                    </TableContent>
                  </TableItem>
                )
              })}
            </TableContainer>
            <ItemContainer>
              <Item>
                <ItemTitle>{t('Total')}</ItemTitle>
                <ItemTitle>
                  {getBalanceBigNumber(totalAmount, isToken ? decimal : 18).toFormat(5)} {isToken ? symbol : 'CORE'}
                </ItemTitle>
              </Item>
              <Item>
                <ItemTitle>{t('Your balance')}</ItemTitle>
                <ItemTitle>
                  {getBalanceBigNumber(isToken ? tokenBalance : ethBalance, isToken ? decimal : 18).toFormat(5)}{' '}
                  {isToken ? symbol : 'CORE'}
                </ItemTitle>
              </Item>
              <Item>
                <ItemTitle1 active={validAmount}>{t('Remaining')}</ItemTitle1>
                <ItemTitle1 active={validAmount}>
                  {getBalanceBigNumber(
                    isToken ? tokenBalance.minus(totalAmount) : ethBalance.minus(totalAmount),
                    isToken ? decimal : 18,
                  ).toFormat(5)}{' '}
                  {isToken ? symbol : 'CORE'}
                </ItemTitle1>
              </Item>
            </ItemContainer>
            <ButtonContainer>
              <Button
                width="100%"
                disabled={
                  pending ||
                  pendingToken ||
                  approvePending ||
                  addressArray.length === 0 ||
                  amountArray.length === 0 ||
                  !validAmount
                }
                onClick={() => {
                  if (!account) {
                    onPresentConnectModal()
                  } else if (validAmount && !pending) {
                    onSendETH()
                  }
                }}
              >
                {!account
                  ? t('Connect Wallet')
                  : pending || pendingToken || approvePending
                  ? `${t('Pending')}...`
                  : needApprove
                  ? t('Approve')
                  : isToken
                  ? t('Disperse Token')
                  : t('Disperse CORE')}
              </Button>
            </ButtonContainer>
          </CardContainer>
        </Container>
      </Page>
    </Background>
  )
}

export default MultiTransfer
