import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = [
  process.env.REACT_APP_NODE_1,
  process.env.REACT_APP_NODE_2,
  process.env.REACT_APP_NODE_3,
  process.env.REACT_APP_NODE_4
]

const rpcs = {
  1116: process.env.REACT_APP_NODE_1,
  1: 'https://mainnet.infura.io/v3/0128e783f02f4a3fab06b35aa5c4fd6e',
  56: 'https://nd-891-303-547.p2pify.com/8bf0ad33fa15a23a6fdf93cd96ffa776',
  137: 'https://rpc-mainnet.matic.network',
  250: 'https://rpc.ftm.tools/',
}

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export const getNodeUrlFromChain = (chainId: string) => {
  return rpcs[chainId]
}

export default getNodeUrl
