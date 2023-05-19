/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button } from 'archerswap-uikit'
import useTheme from 'hooks/useTheme'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Collapse } from 'react-collapse'
import CategoryTab from 'components/Marketplace/CategoryTab'
import SortButtons from 'components/Marketplace/SortButtons'
import NftList from 'components/Marketplace/NftList'
import {
  useCollections,
  useCollectionAttributes,
  useERC721TokenCount,
  useERC721Tokens,
  useERC721RecentEventsLite,
} from 'hooks/api'
import {
  useGetMyCollections,
  useNumTokenListings,
  useTokenListings,
  useGetMyTokenIds,
  useNumTokenWithBids,
  useTokenHighestBids,
} from 'hooks/useNftMarketplace'
import { useETHBalance, useWcoreBalance } from 'hooks/useTokenBalance'

const Background = styled.div<any>`
  width: 100%;
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.card};
`
const MyNftsHeader = styled.div`
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

  .btn-wrap {
    display: flex;
    align-items: center;

    .circle-btn {
      width: 40px;
      height: 40px;
      background: ${({ theme }) => theme.colors.card};
      border-radius: 50%;
      padding: 6px;
    }
    button:not(:last-child) {
      margin-right: 24px;
    }
  }
`

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 85px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 24px;
  }
  .wallet-address-wrap {
    .wallet-icon-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      img {
        margin-right: 12px;
      }
      > div {
        font-weight: 400;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.text};
      }
    }

    .wallet-address {
      font-weight: 400;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  .wallet-balance-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 544px;
    background: ${({ theme }) => theme.colors.card};
    box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
    border-radius: 16px;
    padding: 20px;

    .balance-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .label {
        font-weight: 400;
        font-size: 12px;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 4px;
      }

      .value {
        font-weight: 600;
        font-size: 16px;
        color: ${({ theme }) => theme.colors.text};
      }
    }
    .balance-wrap:first-child {
      margin-right: 108px;
    }
  }
`

const MyCollectionWrap = styled.div`
  width: 100%;

  .collection-info-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 40px 85px;
    @media (max-width: 768px) {
      padding: 24px;
    }
    @media (max-width: 568px) {
      flex-direction: column;
    }
    .collection-info {
      display: flex;
      align-items: center;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 16px;
      }

      .collection-name {
        font-weight: 600;
        font-size: 24px;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 16px;
      }
      button {
        height: 41px;
        background-color: #ecedf0;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        color: #999999;
        padding: 8px 36px;
      }
    }

    .collapse-btn {
      height: 48px;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: 1px solid #3960c1;
      border-radius: 12px;
      box-sizing: border-box;
      padding: 12px 27px;
      font-size: 16px;
      font-weight: 600;
      color: #3960c1;
      cursor: pointer;

      @media (max-width: 568px) {
        margin-top: 24px;
      }

      img {
        margin-left: 22px;
      }
    }
  }
`
const getEllipsis = (str) => {
  return `${str.slice(0, 6)}...${str.slice(-4)}`
}

const MyNfts: React.FC = () => {
  const { isDark } = useTheme()
  const { account } = useWeb3React()

  const collections = useCollections()
  const _myCollections: any = useGetMyCollections(collections)
  const coreBalance = useETHBalance()
  const wcoreBalance = useWcoreBalance()

  const [collectionInfo, setCollectionInfo] = useState<any>({})
  const [MyCollections, setMyCollections] = useState([])

  const [tokenCountInput, setTokenCountInput] = useState<any>({
    filters: {
      traits: [],
    },
  })
  const [traitFilter, setTraitFilter] = useState<any>([])
  const [tokenIds, setTokenIds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [tabType, setTabType] = useState('All')
  const [sortType, setSortType] = useState('')
  const [latestSoldTokens, setLatestSoldTokens] = useState([])

  const attributeInfo: any = useCollectionAttributes(collectionInfo.alias)
  const tokenCountInfo: any = useERC721TokenCount({
    alias: collectionInfo.alias,
    ...tokenCountInput,
    pageSize: collectionInfo?.totalSupply,
  })

  const tokensInfo: any = useERC721Tokens({
    alias: collectionInfo.alias,
    filters: {
      tokenIds,
    },
    // pageSize: collectionInfo?.totalSupply,
  })

  const soldTokens: any = useERC721RecentEventsLite(
    tabType === 'Sold'
      ? {
          chainId: collectionInfo?.chainId,
          tokenAddress: collectionInfo?.address,
          events: ['TokenBought', 'TokenBidAccepted'],
          limit: collectionInfo?.totalSupply,
        }
      : {},
  )

  const totalListingNum: any = useNumTokenListings(collectionInfo?.address)
  const tokenListing: any = useTokenListings(collectionInfo?.address, totalListingNum)
  const myTokenIds: any = useGetMyTokenIds(collectionInfo?.address, 'on')
  const [totalTokenBid, getTokenWithBids]: any = useNumTokenWithBids()
  const [tokenHighestBids, getTokenHighestBids]: any = useTokenHighestBids()

  useEffect(() => {
    setMyCollections(_myCollections)
  }, [_myCollections])

  useEffect(() => {
    if (tabType === 'Offers' && collectionInfo.address) {
      getTokenWithBids(collectionInfo?.address)
    }
  }, [tabType, collectionInfo, getTokenWithBids])

  useEffect(() => {
    if (tabType === 'Offers' && collectionInfo.address && totalTokenBid) {
      getTokenHighestBids(collectionInfo?.address, totalTokenBid)
    }
  }, [tabType, collectionInfo, totalTokenBid, getTokenHighestBids])

  useEffect(() => {
    if (tokenCountInfo && tokenCountInfo.tokens) {
      let tokens = []
      if (tabType === 'All') {
        tokens = tokenCountInfo.tokens
      } else if (tabType === 'Listing') {
        if (sortType === 'price_lowest' || sortType === 'price_highest') {
          tokens = tokenListing
            .filter(
              (t: any) => tokenCountInfo.tokens.findIndex((tl: any) => tl.tokenId === t.tokenId.toString(10)) !== -1,
            )
            .sort((a: any, b: any) => {
              if (sortType === 'price_lowest') {
                if (new BigNumber(a.value).isLessThan(b.value)) {
                  return -1
                }
                if (new BigNumber(a.value).isGreaterThan(b.value)) {
                  return 1
                }
              } else if (sortType === 'price_highest') {
                if (new BigNumber(b.value).isLessThan(a.value)) {
                  return -1
                }
                if (new BigNumber(b.value).isGreaterThan(a.value)) {
                  return 1
                }
              }
              return 0
            })
        } else {
          tokens = tokenCountInfo.tokens.filter(
            (t: any) => tokenListing.findIndex((tl: any) => tl.tokenId.toString(10) === t.tokenId) !== -1,
          )
        }
      } else if (tabType === 'Offers') {
        if (sortType === 'price_lowest' || sortType === 'price_highest') {
          tokens = tokenHighestBids
            .filter(
              (t: any) => tokenCountInfo.tokens.findIndex((tl: any) => tl.tokenId === t.tokenId.toString(10)) !== -1,
            )
            .sort((a: any, b: any) => {
              if (sortType === 'price_lowest') {
                if (new BigNumber(a.value).isLessThan(b.value)) {
                  return -1
                }
                if (new BigNumber(a.value).isGreaterThan(b.value)) {
                  return 1
                }
              } else if (sortType === 'price_highest') {
                if (new BigNumber(b.value).isLessThan(a.value)) {
                  return -1
                }
                if (new BigNumber(b.value).isGreaterThan(a.value)) {
                  return 1
                }
              }
              return 0
            })
        } else {
          tokens = tokenCountInfo.tokens.filter(
            (t: any) => tokenHighestBids.findIndex((tl: any) => tl.tokenId.toString(10) === t.tokenId) !== -1,
          )
        }
      } else if (tabType === 'Sold') {
        const _latestSoldToken: any = []
        soldTokens.map((t: any) => {
          if (_latestSoldToken.findIndex((lt: any) => lt.tokenId === t.tokenId) === -1) {
            _latestSoldToken.push(t)
          }
          return true
        })
        setLatestSoldTokens(soldTokens)
        if (sortType === 'sold_latest' || sortType === 'price_lowest' || sortType === 'price_highest') {
          tokens = _latestSoldToken
            .filter((t: any) => tokenCountInfo.tokens.findIndex((tl: any) => tl.tokenId === t.tokenId) !== -1)
            .sort((a: any, b: any) => {
              if (sortType === 'sold_latest') {
                if (new BigNumber(b.timestamp).isLessThan(a.timestamp)) {
                  return -1
                }
                if (new BigNumber(b.timestamp).isGreaterThan(a.timestamp)) {
                  return 1
                }
              } else if (sortType === 'price_lowest') {
                if (new BigNumber(a.valueNum).isLessThan(b.valueNum)) {
                  return -1
                }
                if (new BigNumber(a.valueNum).isGreaterThan(b.valueNum)) {
                  return 1
                }
              } else if (sortType === 'price_highest') {
                if (new BigNumber(b.valueNum).isLessThan(a.valueNum)) {
                  return -1
                }
                if (new BigNumber(b.valueNum).isGreaterThan(a.valueNum)) {
                  return 1
                }
              }
              return 0
            })
        } else {
          tokens = tokenCountInfo.tokens.filter(
            (t: any) => _latestSoldToken.findIndex((tl: any) => tl.tokenId === t.tokenId) !== -1,
          )
        }
      }
      tokens = tokens.filter((t: any) => myTokenIds.includes(t.tokenId))
      setTotalCount(tokens.length)
      const _tokenIds = tokens
        .filter((_: any, idx: any) => idx < page * 20 && idx >= (page - 1) * 20)
        .map((t: any) => t.tokenId)

      if (_tokenIds.length !== 0) {
        setTokenIds(_tokenIds)
      }
    }
  }, [tabType, sortType, myTokenIds, page, tokenCountInfo, tokenListing, tokenHighestBids, soldTokens])

  const handleSort = (sort: any) => {
    setSortType(sort)
    const orderBy: any = {}
    if (sort === 'lowest') {
      orderBy.direction = 'asc'
      orderBy.key = 'tokenId'
    } else if (sort === 'highest') {
      orderBy.direction = 'desc'
      orderBy.key = 'tokenId'
    } else if (sort === 'rare') {
      orderBy.direction = 'asc'
      orderBy.key = 'rarityRank'
    } else if (sort === 'common') {
      orderBy.direction = 'desc'
      orderBy.key = 'rarityRank'
    }

    setTokenCountInput({
      ...tokenCountInput,
      orderBy,
    })

    setPage(1)
  }

  const handleActivityListing = (type: any) => {
    setTabType(type)
    setPage(1)
  }

  const handleTraits = (traitData: any) => {
    setTraitFilter(traitData)
    setTokenCountInput({
      ...tokenCountInput,
      filters: {
        ...tokenCountInput.filters,
        traits: traitData,
      },
    })
    setPage(1)
  }

  const handleLoadMore = () => {
    if ((tokensInfo?.tokens || []).length !== 0) {
      setTimeout(() => {
        setPage(page + 1)
      }, 1000)
    }
  }

  const handleCollapse = (collection, idx) => {
    MyCollections[idx].isOpen = !MyCollections[idx].isOpen
    setMyCollections([...MyCollections])
    setCollectionInfo(collection)
  }

  return (
    <Background isDark={isDark}>
      <MyNftsHeader>
        <Link to="/marketplace">
          <div className="back-wrap">
            <img src="/images/nfts/marketplace/back.svg" alt="back" />
            <div>All Collections</div>
          </div>
        </Link>
        <div className="btn-wrap">
          {/* <Button className="circle-btn">
            <img src="/images/nfts/marketplace/analytic.svg" alt="analytic" />
          </Button>
          <Button className="circle-btn">
            <img src="/images/nfts/marketplace/search.svg" alt="analytic" />
          </Button> */}
        </div>
      </MyNftsHeader>
      <WalletInfo>
        <div className="wallet-address-wrap">
          <div className="wallet-icon-wrap">
            <img src="/images/nfts/marketplace/wallet.svg" alt="wallet" />
            <div>Wallet address</div>
          </div>
          <div className="wallet-address">{account ? getEllipsis(account) : ''}</div>
        </div>
        <div className="wallet-balance-wrap">
          <div className="balance-wrap">
            <div className="label">CORE Balance</div>
            <div className="value">
              {coreBalance
                .div(10 ** 18)
                .dp(2, 1)
                .toString()}{' '}
              CORE
            </div>
          </div>
          <div className="balance-wrap">
            <div className="label">WCORE Balance</div>
            <div className="value">
              {wcoreBalance
                .div(10 ** 18)
                .dp(2, 1)
                .toString()}{' '}
              WCORE
            </div>
          </div>
        </div>
      </WalletInfo>
      {MyCollections.map((collection, idx) => (
        <MyCollectionWrap key={collection.name}>
          <div className="collection-info-wrap">
            <div className="collection-info">
              <img src={collection.bannerUrl} alt="banner" />
              <div>
                <div className="collection-name">{collection.name}</div>
                <Link to={`/marketplace/${collectionInfo.alias}`}>
                  <Button>View on Marketplace</Button>
                </Link>
              </div>
            </div>
            <Button className="collapse-btn" onClick={() => handleCollapse(collection, idx)}>
              {collection.isOpen ? 'Close' : 'Open'}
              <img
                src={
                  collection.isOpen
                    ? '/images/nfts/marketplace/arrow-up.svg'
                    : '/images/nfts/marketplace/arrow-down.svg'
                }
                alt="arrow"
              />
            </Button>
          </div>
          <Collapse isOpened={collection.isOpen}>
            <CategoryTab onActivityListing={handleActivityListing} />
            <SortButtons
              tabType={tabType}
              collectionInfo={collectionInfo}
              attributeInfo={attributeInfo}
              traitFilter={traitFilter}
              onSort={handleSort}
              onChangeTraits={handleTraits}
            />
            <NftList
              isToggle={false}
              tabType={tabType}
              page={page}
              collectionInfo={collectionInfo}
              tokensInfo={tokensInfo}
              tokenListing={tokenListing}
              tokenHighestBids={tokenHighestBids}
              latestSoldTokens={latestSoldTokens}
              totalCount={totalCount}
              loadMore={handleLoadMore}
            />
          </Collapse>
        </MyCollectionWrap>
      ))}
    </Background>
  )
}

export default MyNfts
