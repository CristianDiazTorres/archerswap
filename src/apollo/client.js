import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const bowClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://subgraph.archerswap.finance/subgraphs/name/archerswap-subgraph',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://subgraph.archerswap.finance/subgraphs/name/tomdoeverything/core-blocks',
  }),
  cache: new InMemoryCache(),
})

export const marketplaceClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://nft.hakuswap.com/graphql',
  }),
  cache: new InMemoryCache(),
})

export default bowClient
