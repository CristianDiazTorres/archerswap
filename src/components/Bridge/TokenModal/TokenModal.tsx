import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'archerswap-uikit'
import styled from 'styled-components'
import useWeb3 from 'hooks/useWeb3'
import { getBalanceBigNumber } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'

interface UserTicketsModalProps {
  serverData: any
  setSelectedToken: (token: any) => void
  onDismiss?: () => void
}

const TokenModal: React.FC<UserTicketsModalProps> = ({ serverData, setSelectedToken, onDismiss }) => {
  const web3 = useWeb3()
  const { account } = useWeb3React()

  const [tokenBalances, setTokenBalance] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const temp: string[] = []
      for (let index = 0; index < serverData.length; index++) {
        const contract = getBep20Contract(serverData[index].originUnderlying.address, web3)
        // eslint-disable-next-line no-await-in-loop
        const res = await contract.methods.balanceOf(account).call()
        temp[index] = getBalanceBigNumber(new BigNumber(res), serverData[index].originUnderlying.decimals).toFormat(3)
      }
      setTokenBalance(temp)
    }
    if (web3 && account && serverData && serverData.length > 0) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3, account, serverData])

  return (
    <Modal title="Select a Token" onDismiss={onDismiss}>
      <TicketsList>
        {serverData &&
          serverData.map((data, index) => {
            return (
              <TokenContainer
                key={index.toString()}
                onClick={() => {
                  setSelectedToken(data)
                  onDismiss()
                }}
              >
                <SuvTokenContainer>
                  <Image src={data.logoUrl} alt="" />
                  <Title>{data.originUnderlying.symbol}</Title>
                </SuvTokenContainer>
                <Amount>{tokenBalances.length > index ? tokenBalances[index] : ''}</Amount>
              </TokenContainer>
            )
          })}
      </TicketsList>
      <StyledButton variant="secondary" onClick={onDismiss}>
        Close
      </StyledButton>
    </Modal>
  )
}

const TokenContainer = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #0000003f;
  }
`
const SuvTokenContainer = styled.div`
  display: flex;
  align-items: center;
`
const Title = styled.div`
  padding-left: 30px;
  color: ${({ theme }) => theme.colors.text};
`
const Amount = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`
const Image = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`
const TicketsList = styled.div`
  text-align: center;
  overflow-y: auto;
  max-height: 400px;
`

const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]}px;
`

export default TokenModal
