/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Link, useParams } from 'react-router-dom'
import CollectionInfo from 'components/Marketplace/CollectionInfo'
import CategoryTab from 'components/Marketplace/CategoryTab'
import SortButtons from 'components/Marketplace/SortButtons'
import NftList from 'components/Marketplace/NftList'
import AnalyticHead from 'components/Marketplace/AnalyticHead'
import {
  useCollection,
  useCollectionAttributes,
  useERC721TokenCount,
  useERC721Tokens,
  useERC721RecentEventsLite,
} from 'hooks/api'
import {
  useNumTokenListings,
  useTokenListings,
  useGetMyTokenIds,
  useNumTokenWithBids,
  useTokenHighestBids,
} from 'hooks/useNftMarketplace'

const Background = styled.div<any>`
  width: 100%;
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.card};
`

const CollectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 25px 85px;
  background-color: ${(props) => props.theme.colors.sidebar};

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

const CollectionDetail: React.FC = () => {
  const { isDark } = useTheme()
  const [tokenCountInput, setTokenCountInput] = useState<any>({
    filters: {
      traits: [],
    },
  })
  const [traitFilter, setTraitFilter] = useState<any>([])
  const [tokenIds, setTokenIds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchNumber, setSearchNumber] = useState('')
  const [page, setPage] = useState(1)
  const [isShowMyNft, setIsShowMyNft] = useState('off')
  const [tabType, setTabType] = useState('All')
  const [sortType, setSortType] = useState('')
  const [latestSoldTokens, setLatestSoldTokens] = useState([])

  const params: any = useParams()

  const collectionInfo: any = useCollection(params.alias)
  const attributeInfo: any = useCollectionAttributes(params.alias)
  const tokenCountInfo: any = useERC721TokenCount({
    alias: params.alias,
    ...tokenCountInput,
    pageSize: collectionInfo?.totalSupply,
  })

  const tokensInfo: any = useERC721Tokens({
    alias: params.alias,
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
  const myTokenIds: any = useGetMyTokenIds(collectionInfo?.address, isShowMyNft)
  const [totalTokenBid, getTokenWithBids]: any = useNumTokenWithBids()
  const [tokenHighestBids, getTokenHighestBids]: any = useTokenHighestBids()

  useEffect(() => {
    setPage(1)
  }, [params.alias])

  useEffect(() => {
    if (tabType === 'Offers') {
      getTokenWithBids(collectionInfo?.address)
    }
  }, [tabType, collectionInfo, getTokenWithBids])

  useEffect(() => {
    if (tabType === 'Offers' && totalTokenBid) {
      getTokenHighestBids(collectionInfo?.address, totalTokenBid)
    }
  }, [tabType, collectionInfo, totalTokenBid, getTokenHighestBids])

  const floor = new BigNumber(
    tokenListing
      .sort((a: any, b: any) => {
        if (new BigNumber(a.value).isGreaterThan(b.value)) {
          return 1
        }
        if (new BigNumber(a.value).isLessThan(b.value)) {
          return -1
        }
        return 0
      })[0]
      ?.value.toString(10) || 0,
  )
    .div(10 ** 18)
    .toString()

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
            .filter((t: any) => tokenCountInfo.tokens.findIndex((tl: any) => tl.tokenId === t.tokenId) !== -1)
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

      if (isShowMyNft === 'on') {
        tokens = tokens.filter((t: any) => myTokenIds.includes(t.tokenId))
      }
      setTotalCount(tokens.filter((t: any) => t.tokenId.includes(searchNumber)).length)
      const _tokenIds = tokens
        .filter((t: any) => t.tokenId.includes(searchNumber))
        .filter((_: any, idx: any) => idx < page * 20 && idx >= (page - 1) * 20)
        .map((t: any) => t.tokenId)

      if (_tokenIds.length !== 0) {
        setTokenIds(_tokenIds)
      }
    }
  }, [
    tabType,
    sortType,
    isShowMyNft,
    myTokenIds,
    page,
    tokenCountInfo,
    searchNumber,
    tokenListing,
    tokenHighestBids,
    soldTokens,
  ])

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

  const handleSearch = (e: any) => {
    setTimeout(() => {
      setPage(1)
      setSearchNumber(e.target.value)
    }, 1000)
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

  const handleMyNftToggle = (v: string) => {
    setIsShowMyNft(v)
    setPage(1)
  }

  return (
    <Background isDark={isDark}>
      <CollectionHeader>
        <Link to="/marketplace">
          <div className="back-wrap">
            <img src="/images/nfts/marketplace/back.svg" alt="back" />
            <div>All Collections</div>
          </div>
        </Link>
        <AnalyticHead />
      </CollectionHeader>
      <CollectionInfo collectionInfo={collectionInfo} floor={floor} onSearch={handleSearch} />
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
        tabType={tabType}
        page={page}
        collectionInfo={collectionInfo}
        tokensInfo={tokensInfo}
        tokenListing={tokenListing}
        tokenHighestBids={tokenHighestBids}
        latestSoldTokens={latestSoldTokens}
        totalCount={totalCount}
        loadMore={handleLoadMore}
        onMyNftToggle={handleMyNftToggle}
      />
    </Background>
  )
}

export default CollectionDetail
