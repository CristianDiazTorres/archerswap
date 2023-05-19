import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getBowContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoContract,
  getMutiContract,
  getAnyswapV5RouterContract,
  getLotteryContract,
  getLotteryTicketContract,
  getMasterchefContract,
  getArcherswapStrategyContract,
  getArcherswapVaultContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getXbowContract,
  getErc721Contract,
  getNftMarketplaceContract,
  getWcoreContract,
  getHunterContract,
  getKyudoNftContract,
} from 'utils/contractHelpers'
// exchange imports
import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from 'archerswap-sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import WETH_ABI from '../constants/abis/weth.json'
import CREATE_LP_ABI from '../constants/abis/createLpAbi.json'
import LP_TOKEN_ABI from '../constants/abis/lpTokenAbi.json'

import SWAP_MINING_ABI from '../constants/abis/swapMining.json'
import { SWAP_MINING_ADDRESS } from '../constants'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import lpTokens from '../constants/lpToken/index.json'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getIfoContract(address, web3), [address, web3])
}

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}
export const useWcore = () => {
  const web3 = useWeb3()
  return useMemo(() => getWcoreContract(web3), [web3])
}
export const useBow = () => {
  const web3 = useWeb3()
  return useMemo(() => getBowContract(web3), [web3])
}

export const useBunnyFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnyFactoryContract(web3), [web3])
}

export const usePancakeRabbits = () => {
  const web3 = useWeb3()
  return useMemo(() => getPancakeRabbitContract(web3), [web3])
}

export const useProfile = () => {
  const web3 = useWeb3()
  return useMemo(() => getProfileContract(web3), [web3])
}

export const useLottery = (lotteryType: string) => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryContract(web3, lotteryType), [web3, lotteryType])
}

export const useLotteryTicket = (lotteryType: string) => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryTicketContract(web3, lotteryType), [web3, lotteryType])
}

export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useMuti = () => {
  const web3 = useWeb3()
  return useMemo(() => getMutiContract(web3), [web3])
}

export const useAnyswapV5 = (routerAddress: string) => {
  const web3 = useWeb3()
  return useMemo(() => getAnyswapV5RouterContract(web3, routerAddress), [web3, routerAddress])
}

export const useArcherswapStrategy = (strategyAddress: string) => {
  const web3 = useWeb3()
  return useMemo(() => getArcherswapStrategyContract(web3, strategyAddress), [web3, strategyAddress])
}

export const useArcherswapVault = (vaultAddress: string) => {
  const web3 = useWeb3()
  return useMemo(() => getArcherswapVaultContract(web3, vaultAddress), [web3, vaultAddress])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPointCenterIfoContract(web3), [web3])
}

export const useBunnySpecialContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnySpecialContract(web3), [web3])
}

export const useClaimRefundContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getClaimRefundContract(web3), [web3])
}

export const useXbow = () => {
  const web3 = useWeb3()
  return useMemo(() => getXbowContract(web3), [web3])
}

export const useERC721 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useMarketplace = () => {
  const web3 = useWeb3()
  return useMemo(() => getNftMarketplaceContract(web3), [web3])
}

export const useHunter = () => {
  const web3 = useWeb3()
  return useMemo(() => getHunterContract(web3), [web3])
}

export const useKyudoNft = () => {
  const web3 = useWeb3()
  return useMemo(() => getKyudoNftContract(web3), [web3])
}


// exchange hooks
// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export const useZapContract = (zapAddress?: string, withSignerIfPossible?: boolean) => {
  return useContract(zapAddress, CREATE_LP_ABI, withSignerIfPossible)
}

export const useLpTokenFromSymbol = (symbol: string, withSignerIfPossible?: boolean) => {
  return useContract(lpTokens.archerswap[symbol].lpAddresses, LP_TOKEN_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.BSCTESTNET:
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useSwapMiningContract(): Contract | null {
  return useContract(SWAP_MINING_ADDRESS, SWAP_MINING_ABI, true)
}
