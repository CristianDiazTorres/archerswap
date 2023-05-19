import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import getRpcUrl, { getNodeUrlFromChain } from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
const web3NoAccount = new Web3(httpProvider)
const getWeb3NoAccount = () => {
  return web3NoAccount
}

const getWeb3NoAccountFromChain = (chainId: string) => {
  const httpProviderFromChain = new Web3.providers.HttpProvider(getNodeUrlFromChain(chainId), {
    timeout: 10000,
  } as HttpProviderOptions)
  return new Web3(httpProviderFromChain)
}

export { getWeb3NoAccount, getWeb3NoAccountFromChain }
export default web3NoAccount
