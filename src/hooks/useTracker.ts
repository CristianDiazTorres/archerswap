import { useEffect, useState } from 'react'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { getTrackerAddress } from 'utils/addressHelpers'
import trackerABI from 'config/abi/tracker.json'
import useRefresh from './useRefresh'

export const useTracker = () => {
  const { slowRefresh } = useRefresh()

  const [totalDividendsDistributed, setTotalDividendsDistributed] = useState(new BigNumber(0))
  const [totalDividendsWithdrawn, setTotalDividendsWithdrawn] = useState(new BigNumber(0))

  useEffect(() => {
    const fetch = async () => {
      const calls = []
      calls.push({ address: getTrackerAddress(), name: 'totalDividendsDistributed', params: [] })
      calls.push({ address: getTrackerAddress(), name: 'totalDividendsWithdrawn', params: [] })

      const data = await multicall(trackerABI, calls)

      setTotalDividendsDistributed(new BigNumber(data[0][0].toString()))
      setTotalDividendsWithdrawn(new BigNumber(data[1][0].toString()))
    }

    fetch()
  }, [slowRefresh])

  return {
    totalDividendsDistributed,
    totalDividendsWithdrawn,
  }
}

export default useTracker
