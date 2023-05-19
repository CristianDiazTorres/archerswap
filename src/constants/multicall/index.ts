import { ChainId } from 'archerswap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x40fcd694c9ebbc46a2230ad498fbde11ae0111a8', // TODO
  [ChainId.BSCTESTNET]: '0x40fcd694c9ebbc46a2230ad498fbde11ae0111a8',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
