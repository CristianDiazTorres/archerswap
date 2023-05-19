import { useEffect, useState } from 'react'
import { bowClient, marketplaceClient } from '../apollo/client'
import {
  factoryQuery,
  tokensQuery,
  getERC721CollectionsQuery,
  getERC721CollectionQuery,
  getERC721CollectionAttributesQuery,
  getERC721TokenCountQuery,
  getERC721TokensQuery,
  ERC721RecentEventsLiteQuery,
  getERC721TokenQuery,
  ERC721TokenEventsQuery,
} from '../apollo/queries'

/* eslint-disable camelcase */

export interface TradePair {
  swap_pair_contract: string
  base_symbol: string
  quote_symbol: string
  last_price: number
  base_volume_24_h: number
  quote_volume_24_h: number
}

export interface ApiStatResponse {
  update_at: string
  '24h_total_volume': number
  total_value_locked: number
  total_value_locked_all: number
  trade_pairs: {
    [key: string]: TradePair
  }
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await bowClient.query({
          query: factoryQuery,
          variables: {},
          fetchPolicy: 'no-cache',
        })

        if (result?.data) {
          let pairTVL = 0
          result.data.uniswapFactories.map((factory) => {
            pairTVL += parseFloat(factory.totalLiquidityUSD)
            return pairTVL
          })

          const responsedata: ApiStatResponse = {
            update_at: '',
            '24h_total_volume': 0,
            total_value_locked: 0,
            total_value_locked_all: pairTVL,
            trade_pairs: null,
          }
          setData(responsedata)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useTokensData = () => {
  const [data, setData] = useState<ApiStatResponse | 0>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await bowClient.query({
          query: tokensQuery,
          variables: {},
          fetchPolicy: 'no-cache',
        })
        setData(result?.data?.tokens.length)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

// Marketplace GraphQL

export const useCollections = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await marketplaceClient.query({
          query: getERC721CollectionsQuery,
          variables: {},
          fetchPolicy: 'no-cache',
        })
        setData(res.GetERC721Collections || [])
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useCollection = (alias: string) => {
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: getERC721CollectionQuery(alias),
          variables: {},
          fetchPolicy: 'no-cache',
        })
        if (res.GetERC721Collection && res.GetERC721Collection.length !== 0) {
          setData(res.GetERC721Collection[0])
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [alias])

  return data
}

export const useCollectionAttributes = (alias: string) => {
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: getERC721CollectionAttributesQuery(alias),
          variables: {},
          fetchPolicy: 'no-cache',
        })
        if (res.GetERC721CollectionAttributes) {
          setData(res.GetERC721CollectionAttributes)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [alias])

  return data
}

let currentInput1 = {}
export const useERC721TokenCount = (input: any) => {
  const [data, setData] = useState({})

  useEffect(() => {
    currentInput1 = {}
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: getERC721TokenCountQuery,
          variables: { input },
          fetchPolicy: 'no-cache',
        })
        if (res.GetERC721TokenCount) {
          setData(res.GetERC721TokenCount)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (input.pageSize && input.filters && JSON.stringify(input) !== JSON.stringify(currentInput1)) {
      currentInput1 = input
      fetchData()
    }
  }, [input])

  return data
}

let currentInput2 = {}
export const useERC721Tokens = (input: any) => {
  const [data, setData] = useState({})

  useEffect(() => {
    currentInput2 = {}
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: getERC721TokensQuery,
          variables: { input },
          fetchPolicy: 'no-cache',
        })
        if (res.GetERC721Tokens) {
          setData(res.GetERC721Tokens)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (JSON.stringify(input) !== JSON.stringify(currentInput2)) {
      currentInput2 = input
      fetchData()
    }
  }, [input])

  return data
}

let currentInput3 = {}
export const useERC721RecentEventsLite = (input: any) => {
  const [data, setData] = useState([])

  useEffect(() => {
    currentInput3 = {}
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: ERC721RecentEventsLiteQuery,
          variables: { input },
          fetchPolicy: 'no-cache',
        })
        if (res.ERC721RecentEventsLite) {
          setData(res.ERC721RecentEventsLite)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (input.chainId && input.tokenAddress && JSON.stringify(input) !== JSON.stringify(currentInput3)) {
      currentInput3 = input
      fetchData()
    }
  }, [input])

  return data
}

export const useERC721Token = (alias: string, tokenId: string) => {
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: getERC721TokenQuery(alias, tokenId),
          variables: {},
          fetchPolicy: 'no-cache',
        })
        if (res.GetERC721Token) {
          setData(res.GetERC721Token)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [alias, tokenId])

  return data
}

let currentInput4 = {}
export const useERC721TokenEvents = (input: any) => {
  const [data, setData] = useState([])

  useEffect(() => {
    currentInput4 = {}
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res }: any = await marketplaceClient.query({
          query: ERC721TokenEventsQuery,
          variables: { input },
          fetchPolicy: 'no-cache',
        })
        if (res.ERC721TokenEvents) {
          setData(res.ERC721TokenEvents)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (input.chainId && input.tokenAddress && JSON.stringify(input) !== JSON.stringify(currentInput4)) {
      currentInput4 = input
      fetchData()
    }
  }, [input])

  return data
}
