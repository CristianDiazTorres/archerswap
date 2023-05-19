import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 1116
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getBowAddress = () => {
  return getAddress(tokens.bow.address)
}
export const getMultiAddress = () => {
  return getAddress(addresses.multi)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.mulltiCall)
}
export const getWcoreAddress = () => {
  return getAddress(tokens.wcore.address)
}
export const getLotteryAddress = (lotteryType: string) => {
  if (lotteryType === 'bow') return getAddress(addresses.lottery)
  return getAddress(addresses.lotteryCore)
}
export const getLotteryTicketAddress = (lotteryType: string) => {
  if (lotteryType === 'bow') return getAddress(addresses.lotteryNFT)
  return getAddress(addresses.lotteryNFTCore)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getXbowAddress = () => {
  return getAddress(addresses.xbow)
}
export const getFactoryAddress = () => {
  return getAddress(addresses.factory)
}
export const getNftMarketplaceAddress = () => {
  return getAddress(addresses.nftMarketplace)
}
export const getHunterAddress = () => {
  return getAddress(addresses.hunter)
}
export const getTrackerAddress = () => {
  return getAddress(addresses.tracker)
}
export const getHunterCoreLPAddress = () => {
  return getAddress(addresses.hunterCoreLP)
}
export const getKyudoNftAddress = () => {
  return getAddress(addresses.kyudoNft)
}
