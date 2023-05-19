import gql from 'graphql-tag'
import { getFactoryAddress } from 'utils/addressHelpers'

export const factoryQuery = gql`
  {
    uniswapFactories {
      totalLiquidityETH
      totalLiquidityUSD
    }
  }
`

export const pairsQuery = gql`
  {
    pairs {
      id
      reserveUSD
      totalSupply
    }
  }
`

export const tokensQuery = gql`
  {
    tokens(first: 1000, skip: $skip) {
      name
      symbol
    }
  }
`

export const allPricesQuery = gql`
  {
    tokens {
      id
      symbol
      name
      derivedBNB: derivedETH
      tokenDayData(orderBy: date, orderDirection: desc, first: 1) {
        id
        dailyTxns
        priceUSD
      }
    }
  }
`

export const allTimeVolumeQuery = gql`
  {
    uniswapFactories {
      untrackedVolumeUSD
    }
  }
`

export const PAIR_DAY_DATA_BULK = (pairList) => {
  const yesterday = (Math.floor(new Date().getTime() / 86400 / 1000) - 1) * 86400 // EE yesterdays data
  let pairString = '['
  pairList.slice(0, pairList.length - 1).forEach((pair) => {
    pairString += `"${pair}",`
  })
  pairString += `"${pairList.length ? pairList[pairList.length - 1] : ''}"]`
  const queryString = `
      query days {
        pairDayDatas(first: 30, where: { pairAddress_in: ${pairString}, date: ${yesterday}}) {
            pairAddress
          dailyVolumeUSD
          reserveUSD
        }
      } 
  `
  return gql(queryString)
}

export const TOTAL_VOLUME_DATA = (block) => {
  const queryString = ` query uniswapFactories {
      uniswapFactories(
       ${block ? `block: { number: ${block}}` : ``} 
       where: { id: "${getFactoryAddress().toLocaleLowerCase()}" }) {
        totalVolumeUSD
      }
    }`
  return gql(queryString)
}

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const getERC721CollectionsQuery = gql`
  {
    GetERC721Collections {
      alias
      name
      address
      itemName
      websiteUrl
      bannerUrl
      thumbnailUrl
      headerUrl
      isPixel
      frontendPath
      socialShareUrl
      maxSupply
      totalSupply
      totalVolume
      last24HVolume
      last7DVolume
      last30DVolume
      marketplaceAddress
      marketplaceV2Address
      chainId
    }
  }
`
export const getERC721CollectionQuery = (alias) => {
  return gql`
    {
      GetERC721Collection(alias: "${alias}") {
        alias
        name
        address
        itemName
        websiteUrl
        owners
        bannerUrl
        thumbnailUrl
        headerUrl
        isPixel
        frontendPath
        socialShareUrl
        maxSupply
        totalSupply
        totalVolume
        last24HVolume
        last7DVolume
        last30DVolume
        marketplaceAddress
        marketplaceV2Address
        chainId
      }
    }`
}

export const getERC721CollectionAttributesQuery = (alias) => {
  return gql`
    {
      GetERC721CollectionAttributes(alias: "${alias}") {
        alias
        attributeCategories {
          type
          values {
            value
            count
          }
        }
      }
    }`
}

export const getERC721TokenCountQuery = gql`
  query GetERC721TokenCount($input: GetERC721TokensInput!) {
    GetERC721TokenCount(input: $input) {
      count
      tokens {
        tokenId
      }
    }
  }
`

export const getERC721TokensQuery = gql`
  query GetERC721Tokens($input: GetERC721TokensInput!) {
    GetERC721Tokens(input: $input) {
      count
      tokens {
        tokenId
        name
        image
        imageCdnUrl
        thumbnailCdnUrl
        imageContentType
        background
        backgroundUrl
        rarityRank
      }
    }
  }
`

export const ERC721RecentEventsLiteQuery = gql`
  query ERC721RecentEventsLite($input: RecentlyEventsInput!) {
    ERC721RecentEventsLite(input: $input) {
      id
      tokenId
      event
      from
      valueNum
      timestamp
    }
  }
`

export const getERC721TokenQuery = (alias, tokenId) => {
  return gql`
    {
      GetERC721Token(alias: "${alias}", tokenId: "${tokenId}") {
        tokenId
        name
        image
        imageCdnUrl
        thumbnailCdnUrl
        imageContentType
        background
        backgroundUrl
        animationUrl
        rarityRank
        attributes {
          trait_type
          value
        }
      }
    }`
}

export const ERC721TokenEventsQuery = gql`
  query ERC721TokenEvents($input: ERC721TokenEventsInput!) {
    ERC721TokenEvents(input: $input) {
      id
      transactionHash
      event
      from
      to
      valueNum
      timestamp
    }
  }
`
