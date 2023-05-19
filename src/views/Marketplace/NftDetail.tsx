/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'
import Info from 'components/Marketplace/TokenDetails/Info/Info'
import TokenImage from 'components/Marketplace/TokenDetails/TokenImage/TokenImage'
import Details from 'components/Marketplace/TokenDetails/Details/Details'
import Offers from 'components/Marketplace/TokenDetails/Offers/Offers'
import History from 'components/Marketplace/TokenDetails/History/History'
import AnalyticHead from 'components/Marketplace/AnalyticHead'
import { useCollection, useCollectionAttributes, useERC721Token, useERC721TokenEvents } from 'hooks/api'
import {
  useGetOwnerOfToken,
  useGetServiceFee,
  useGetRoyalty,
  useGetTokenBids,
  useWithdrawBidToken,
  useAcceptBidToken,
} from 'hooks/useNftMarketplace'
import { usePriceCoreUsd } from 'state/hooks'

const Background = styled.div<any>`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding-bottom: 100px;
`
const NftDetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 25px 85px;
  background: ${({ theme }) => theme.colors.card};

  @media (max-width: 768px) {
    padding: 24px;
  }

  .back-wrap {
    display: flex;
    align-items: center;
    img {
      margin-right: 20px;
    }
    > div {
      font-weight: 500;
      font-size: 16px;
      color: ${({ theme }) => theme.colors.text};
    }
  }
`
const NftDetailContent = styled.div`
  display: flex;
  padding: 0px 85px;
  background: ${({ theme }) => theme.colors.card};
  max-width: 1200px;
  @media (max-width: 768px) {
    padding: 0px 24px;
  }
  .left-side {
    width: 100%;
    max-width: 469px;
    .nft-art {
      width: 100%;
      border-radius: 20px;
      margin-bottom: 40px;
    }
  }
  .right-side {
    flex: 1;
    max-width: 480px;
    margin-left: 35px;
  }
`

const NftDetail: React.FC = () => {
  const theme = useTheme()
  const params: any = useParams()

  const { account } = useWeb3React()

  const collectionInfo: any = useCollection(params.alias)
  const attributeInfo: any = useCollectionAttributes(params.alias)
  const tokenInfo: any = useERC721Token(params.alias, params.tokenId)

  const tokenEvents: any = useERC721TokenEvents({
    chainId: collectionInfo?.chainId,
    tokenAddress: collectionInfo?.address,
    tokenId: params.tokenId,
  })

  const [tokenOwner, getOwnerOfToken]: any = useGetOwnerOfToken(collectionInfo?.address)
  const serviceFee: any = useGetServiceFee()
  const royalty: any = useGetRoyalty(collectionInfo?.address)

  const priceData: any = usePriceCoreUsd()
  const [tokenBids, getTokenBids]: any = useGetTokenBids()
  const [isWithdrawLoading, isWithdrawBid, withdrawBidToken]: any = useWithdrawBidToken()
  const [isAcceptBidLoading, isAcceptBid, acceptBidToken]: any = useAcceptBidToken()

  useEffect(() => {
    getOwnerOfToken(params.tokenId)
  }, [collectionInfo, params, account, isAcceptBid, getOwnerOfToken])

  useEffect(() => {
    getTokenBids(collectionInfo?.address, tokenInfo?.tokenId)
  }, [collectionInfo, tokenInfo, account, isWithdrawBid, isAcceptBid, getTokenBids])

  const handleCancelBid = () => {
    withdrawBidToken(collectionInfo?.address, tokenInfo?.tokenId)
  }

  const handleAcceptBid = (bidInfo: any) => {
    acceptBidToken(collectionInfo?.address, bidInfo?.tokenId, bidInfo?.fromFullAddress, bidInfo?.rawWcore)
  }

  return (
    <Background>
      <NftDetailHeader>
        <Link to={`/marketplace/${params.alias}`}>
          <div className="back-wrap">
            <img src="/images/nfts/marketplace/back.svg" alt="back" />
            <div>{params.alias}</div>
          </div>
        </Link>
        <AnalyticHead />
      </NftDetailHeader>
      <NftDetailContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <TokenImage imageUrl={tokenInfo?.image} />
            {useMediaQuery(theme.breakpoints.up('md')) && (
              <>
                {tokenEvents.length !== 0 && <History tokenEvents={tokenEvents} />}
                <Info collectionInfo={collectionInfo} />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <Details
              collectionInfo={collectionInfo}
              tokenInfo={tokenInfo}
              attributeInfo={attributeInfo}
              tokenOwner={tokenOwner}
              priceData={priceData}
              serviceFee={serviceFee}
              royalty={royalty}
              isWithdrawBid={isWithdrawBid}
              onPlaceBid={() => {
                getTokenBids(collectionInfo?.address, tokenInfo?.tokenId)
              }}
            />
            {tokenBids.length !== 0 && (
              <Offers
                tokenBids={tokenBids}
                priceData={priceData}
                account={account}
                tokenOwner={tokenOwner}
                onCancelBid={handleCancelBid}
                onAcceptBid={handleAcceptBid}
              />
            )}
            {useMediaQuery(theme.breakpoints.down('md')) && (
              <>
                {tokenEvents.length !== 0 && <History tokenEvents={tokenEvents} />}
                <Info collectionInfo={collectionInfo} />
              </>
            )}
          </Grid>
        </Grid>
      </NftDetailContent>
    </Background>
  )
}

export default NftDetail
