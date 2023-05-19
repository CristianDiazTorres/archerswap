import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { Toast, toastTypes } from 'archerswap-uikit'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import { getWeb3NoAccount } from 'utils/web3'
import useRefresh from 'hooks/useRefresh'
import useBowInfo from 'hooks/useBowInfo'
import { getHunterCoreLPAddress, getHunterAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import LpAbi from 'config/abi/UniV2LP.json'
import {
  fetchFarmsPublicDataAsync,
  fetchVaultsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchAllTimeVolumePublicDataAsync,
  fetchOneDayVolumePublicDataAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  setBlock,
} from './actions'
import {
  State,
  Farm,
  Pool,
  Vault,
  Block,
  ProfileState,
  TeamsState,
  AchievementState,
  AllTimeState,
  OneDayState,
} from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchPrices } from './prices'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
    dispatch(fetchVaultsPublicDataAsync())
    dispatch(fetchAllTimeVolumePublicDataAsync())
    dispatch(fetchOneDayVolumePublicDataAsync())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    const web3 = getWeb3NoAccount()
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm && farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm && farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm && farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm && farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Vaults

export const useValuts = (): Vault[] => {
  const vaults = useSelector((state: State) => state.vaults.data)
  return vaults
}

export const useVaultFromPid = (pid, provider): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.pid === pid && f.provider === provider))
  return vault
}

export const useVaultFromSymbol = (lpSymbol: string): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.lpSymbol === lpSymbol))
  return vault
}

export const useVaultUser = (pid, provider) => {
  const vault = useVaultFromPid(pid, provider)

  return {
    allowance: vault && vault.userData ? new BigNumber(vault.userData.allowance) : new BigNumber(0),
    tokenBalance: vault && vault.userData ? new BigNumber(vault.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: vault && vault.userData ? new BigNumber(vault.userData.stakedBalance) : new BigNumber(0),
    earnings: vault && vault.userData ? new BigNumber(vault.userData.earnings) : new BigNumber(0),
  }
}

// All Time Volume

export const useAllTimeVolume = (): AllTimeState => {
  const data = useSelector((state: State) => state.allTimeVolume)
  return data
}

// All Time Volume

export const useOneDayVolume = (): OneDayState => {
  const data = useSelector((state: State) => state.oneDayVolume)
  return data
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrice = (token: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[token.toLowerCase()]
}

// Block
export const useBlock = (): Block => {
  return useSelector((state: State) => state.block)
}

const defaultFetcher = (url) => fetch(url).then((res) => res.json())
export function useCoingeckoPrices(url: string, defaultValue: number, symbol, fetcher = defaultFetcher) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(defaultValue)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const temp = await fetcher(url)
        setData(temp[symbol].usd)
      } catch (ex) {
        console.error(ex)
        setError(ex)
      }
      setLoading(false)
    }

    fetchData()
  }, [url, symbol, fetcher])

  return [data, loading, error]
}

// Prices
export const usePriceCoreUsd = (): BigNumber => {
  // const url = `https://api.coingecko.com/api/v3/simple/price?ids=coredaoorg&vs_currencies=usd`
  // const [res, loading, error] = useCoingeckoPrices(url, 3, 'coredaoorg')
  // return new BigNumber(res)
  const pid = 4 // CORE-USDC LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceBowUsd = (): BigNumber => {
  const pid = 1 // BOW-CORE LP
  const corePriceUSD = usePriceCoreUsd()
  const farm = useFarmFromPid(pid)
  const price = farm.tokenPriceVsQuote ? corePriceUSD.times(farm.tokenPriceVsQuote) : ZERO
  return price.isZero() ? new BigNumber(0.25) : price
}

export const usePriceEthUsd = (): BigNumber => {
  // const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
  // const [res, loading, error] = useCoingeckoPrices(url, 1500, 'ethereum')
  // return new BigNumber(res)
  const pid = 6 // WETH-USDT LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? farm.tokenPriceVsQuote : ZERO
}

export const usePrice4TokenUsd = (): BigNumber => {
  const pid = 10 // 4TOKEN-WCORE LP
  const corePriceUSD = usePriceCoreUsd()
  const farm = useFarmFromPid(pid)
  const price = farm.tokenPriceVsQuote ? corePriceUSD.times(farm.tokenPriceVsQuote) : ZERO
  return price
}

export const useGetApiPrices = () => {
  // const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  const corePriceUSD = usePriceCoreUsd()
  const bowPriceUSD = usePriceBowUsd()
  const ethPriceUSD = usePriceEthUsd()
  const { xbowRatio } = useBowInfo()
  const huntPriceUSD = usePriceHunterUsd()
  const fourTokenPriceUSD = usePrice4TokenUsd()

  return {
    usdt: new BigNumber(1),
    usdc: new BigNumber(1),
    dai: new BigNumber(1),
    busd: new BigNumber(1),
    weth: ethPriceUSD,
    wcore: corePriceUSD,
    bow: bowPriceUSD,
    xbow: bowPriceUSD.times(xbowRatio),
    hunt: huntPriceUSD,
    '4token': fourTokenPriceUSD,
  }
}

export const usePriceHunterUsd = (): BigNumber => {
  const [priceInCore, setPriceInCore] = useState(new BigNumber(0))
  const corePriceUSD = usePriceCoreUsd()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetch = async () => {
      const calls = []
      calls.push({ address: getHunterCoreLPAddress(), name: 'token0', params: [] })
      calls.push({ address: getHunterCoreLPAddress(), name: 'getReserves', params: [] })

      const data = await multicall(LpAbi, calls)

      const token0 = data[0][0]
      const reserve0 = data[1][0]
      const reserve1 = data[1][1]
      if (reserve0.gt(0)) {
        if (token0.toLowerCase() === getHunterAddress().toLowerCase()) {
          setPriceInCore(new BigNumber(reserve1.toString()).div(new BigNumber(reserve0.toString())))
        } else {
          setPriceInCore(new BigNumber(reserve0.toString()).div(new BigNumber(reserve1.toString())))
        }
      }
    }

    fetch()
  }, [fastRefresh])

  return priceInCore.gt(0) ? priceInCore.times(corePriceUSD) : new BigNumber(0.4)
}
