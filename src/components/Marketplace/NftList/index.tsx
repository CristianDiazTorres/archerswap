import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'
import Grid from '@mui/material/Grid'
import NftCard from 'components/Marketplace/NftCard'

const NftListContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 0px 85px;

  @media (max-width: 768px) {
    padding: 0px 24px;
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    .total-supply {
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text};
    }

    .my-nfts-toggle {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text};

      .toggle-wrap {
        display: flex;
        align-items: center;
        margin-left: 24px;
        background: ${({ theme }) => theme.colors.card};
        border-radius: 32px;

        .toggle-item {
          padding: 4px 23px;
          border-radius: 32px;
          font-size: 16px;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.text};
          cursor: pointer;
        }

        .toggle-active {
          color: white;
          background-color: #2a4aa6;
        }
      }
    }
  }
`
let _tokens = []

const NftList = ({
  isToggle = true,
  tabType,
  page,
  collectionInfo,
  tokensInfo,
  tokenListing,
  tokenHighestBids = [],
  latestSoldTokens = [],
  totalCount,
  loadMore,
  onMyNftToggle,
}: any) => {
  const [isMyNFT, setIsMyNFT] = useState('off')
  const [tokens, setTokens] = useState<any>([])

  useEffect(() => {
    if (page === 1) {
      _tokens = []
    }
    const nftTokens = tokensInfo?.tokens || []
    nftTokens.map((t: any) => {
      if (_tokens.findIndex((_t: any) => _t.tokenId === t.tokenId) === -1) {
        _tokens.push(t)
      }
      return true
    })
    setTokens(_tokens)
  }, [page, tokensInfo])

  return (
    <NftListContainer>
      <div className="list-header">
        <div className="total-supply">{totalCount || 0} Results</div>
        {isToggle && (
          <div className="my-nfts-toggle">
            My NFTs
            <div className="toggle-wrap">
              <div
                className={`toggle-item ${isMyNFT === 'off' ? 'toggle-active' : ''}`}
                onClick={() => {
                  setIsMyNFT('off')
                  onMyNftToggle('off')
                }}
                role="presentation"
              >
                Off
              </div>
              <div
                className={`toggle-item ${isMyNFT === 'on' ? 'toggle-active' : ''}`}
                onClick={() => {
                  setIsMyNFT('on')
                  onMyNftToggle('on')
                }}
                role="presentation"
              >
                On
              </div>
            </div>
          </div>
        )}
      </div>
      {totalCount ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={tokens.length !== (totalCount || 0)}
          loader={
            <div className="nft-loader" key={0}>
              Loading ...
            </div>
          }
        >
          <Grid container spacing={4} sx={{ pb: 11 }}>
            {tokens.map((token: any) => (
              <Grid item key={token.tokenId} xs={12} sm={6} lg={3} xl={2.4}>
                <NftCard
                  tabType={tabType}
                  tokenHighestBids={tokenHighestBids}
                  latestSoldTokens={latestSoldTokens}
                  collectionInfo={collectionInfo}
                  token={token}
                  tokenListing={tokenListing}
                  isMyNFT={isMyNFT === 'on'}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      ) : (
        ''
      )}
    </NftListContainer>
  )
}

export default NftList
