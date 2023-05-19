import { TranslatableText } from 'state/types'

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

export interface Ifo {
  id: string
  isActive: boolean
  isPrivate: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
  currencyDecimals: number
  tokenDecimals: number
  tokenSymbol: string
  releaseTime: number
  campaignId?: string
  maxDepositAmount?: number
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
}

export interface Address {
  1115?: string
  1116: string
}

export interface Token {
  symbol: string
  address?: Address
  decimals?: number
  projectLink?: string
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  token: Token
  quoteToken: Token
  multiplier?: string
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface VaultConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  vaultAddresses: Address
  strategyAddresses: Address
  stratxAddress?: Address
  token: Token
  quoteToken?: Token
  ftoken?: Token
  provider?: string
  multiplier?: string
  isCommunity?: boolean
  isSingle?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolConfig {
  sousId: number
  earningToken: Token
  stakingToken: Token
  stakingLimit?: number
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerSecond: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  depositFee?: number
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type NftImages = {
  blur?: string
} & Images

export type NftVideo = {
  webm: string
  mp4: string
}

export type Nft = {
  name: string
  description: string
  images: NftImages
  sortOrder: number
  bunnyId: number
  video?: NftVideo
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}
