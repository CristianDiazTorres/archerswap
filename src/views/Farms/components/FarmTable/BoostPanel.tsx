import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useMatchBreakpoints, Button, useWalletModal, useModal, Text } from 'archerswap-uikit'
import useAuth from 'hooks/useAuth'
import { useApproveCallback, useWithdrawNFTCallback } from 'hooks/useKyudoNFT'
import Tooltip from '../Tooltip/Tooltip'
import BoostModal from './BoostModal'

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 26px;
  padding-top: 10px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
    padding-top: 5px;
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 48%;
  min-width: 200px;
  @media (max-width: 768px) {
    min-height: 75px;
    width: 100%;
    padding-top: 25px;
  }
`

const NFTContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  flex-grow: 1;
  @media (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

const NFTBox = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border-radius: 15px;
  width: 80px;
  height: 80px;
  padding: 0;
  line-height: 0;
`

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`

const baseUrl = 'https://bafybeidcbdmm6pzmravo6mwygqdmxxoexbrmsoomln7ume3i75at26w6sq.ipfs.nftstorage.link'
const baseUrl1 = 'https://bafybeigcxihqs7vtrfdxzdy36qh4j26vk7yixq3csj5z7otjeerfrcnhoi.ipfs.nftstorage.link'

const getUrl = (id) => {
  if (id <= 5000) {
    return `${baseUrl}/${id}.png`
  }

  return `${baseUrl1}/${id}.png`
}

interface BoostPanelProps {
  pid: number
  isApproved: boolean
  tokenIds: undefined | number[] | undefined[]
  boost: undefined | number
}

const BoostPanel: React.FunctionComponent<BoostPanelProps> = ({ pid, isApproved, tokenIds, boost }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  const { handleApprove, pending: approvePending } = useApproveCallback()
  const { handleWithdrawNFT, pending: withdawPenidng } = useWithdrawNFTCallback()

  const [onBoost1] = useModal(<BoostModal pid={pid} slot={1} />)
  const [onBoost2] = useModal(<BoostModal pid={pid} slot={2} />)
  const [onBoost3] = useModal(<BoostModal pid={pid} slot={3} />)

  const onBoxClick = async (slotNum) => {
    if (!account) {
      onPresentConnectModal()
      return
    }
    if (!isApproved) {
      await handleApprove()
      return
    }
    if (tokenIds[slotNum - 1]) {
      await handleWithdrawNFT(slotNum, pid)
      return
    }

    if (slotNum === 1) {
      onBoost1()
    } else if (slotNum === 2) {
      onBoost2()
    } else if (slotNum === 3) {
      onBoost3()
    }
  }

  return (
    <Container>
      <InfoContainer>
        {!isMobile && <Text>{t('Stake NFT to increase BOW Earning')} 🚀</Text>}
        <Text>{t('CURRENT BOOST')}</Text>
        <Text>{boost}%</Text>
      </InfoContainer>
      <NFTContainer>
        {[1, 2, 3].map((e) => (
          <NFTBox key={e} disabled={approvePending || withdawPenidng} onClick={() => onBoxClick(e)}>
            {tokenIds && tokenIds[e - 1] ? (
              <Tooltip content={`Token ID: ${tokenIds[e - 1]}`}>
                <StyledImg src={getUrl(Number(tokenIds[e - 1]))} alt="" />
              </Tooltip>
            ) : (
              <>+</>
            )}
          </NFTBox>
        ))}
      </NFTContainer>
    </Container>
  )
}

export default BoostPanel
