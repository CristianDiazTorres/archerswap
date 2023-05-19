import BigNumber from 'bignumber.js'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useBlock } from 'state/hooks'
import { useIfoContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import makeBatchRequest from 'utils/makeBatchRequest'

export interface PublicIfoState {
  status: IfoStatus
  // blocksRemaining: number
  // blocksRemainingToStart: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  raisingAmount: BigNumber
  totalAmount: BigNumber
  startTimestamp: number
  endTimestamp: number
  liquidityIsCreated?: boolean
}

const getStatus = (currentTime: number, startTime: number, endTime: number): IfoStatus => {
  // Add an extra check to currentTime because it takes awhile to fetch so the initial value is 0
  // making the UI change to an inaccurate status
  if (currentTime === 0) {
    return 'idle'
  }

  if (currentTime < startTime) {
    return 'coming_soon'
  }

  if (currentTime >= startTime && currentTime <= endTime) {
    return 'live'
  }

  if (currentTime > endTime) {
    return 'finished'
  }

  return 'idle'
}

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo) => {
  const { address, releaseTime } = ifo
  const [state, setState] = useState<PublicIfoState>({
    status: 'idle',
    // blocksRemaining: 0,
    // blocksRemainingToStart: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    raisingAmount: new BigNumber(0),
    totalAmount: new BigNumber(0),
    startTimestamp: 0,
    endTimestamp: 0,
    liquidityIsCreated: false,
  })
  const { blockNumber: currentBlock } = useBlock()
  const contract = useIfoContract(address)

  useEffect(() => {
    const fetchProgress = async () => {
      const [startTime, endTime, raisingAmount, totalAmount, liquidityIsCreated] = (await makeBatchRequest([
        contract.methods.startTime().call,
        contract.methods.endTime().call,
        contract.methods.raisingAmount().call,
        contract.methods.totalAmount().call,
        contract.methods.liquidityIsCreated().call,
      ])) as [string, string, string, string, boolean]

      const startTimestamp = parseInt(startTime, 10)
      const endTimestamp = parseInt(endTime, 10)

      const currentTime = Math.floor(Date.now() / 1000)
      const status = getStatus(currentTime, startTimestamp, endTimestamp)
      const totalSeconds = endTimestamp - startTimestamp
      // const blocksRemaining = endTimestamp - currentTime
      // const blocksRemainingToStart = startTimestamp - currentTime

      // Calculate the total progress until finished or until start
      const progress =
        currentTime > startTimestamp
          ? ((currentTime - startTimestamp) / totalSeconds) * 100
          : ((currentTime - releaseTime) / (startTimestamp - releaseTime)) * 100

      setState({
        secondsUntilEnd: endTimestamp - currentTime,
        secondsUntilStart: startTimestamp - currentTime,
        raisingAmount: new BigNumber(raisingAmount),
        totalAmount: new BigNumber(totalAmount),
        status,
        progress,
        // blocksRemaining,
        // blocksRemainingToStart,
        startTimestamp,
        endTimestamp,
        liquidityIsCreated,
      })
    }

    fetchProgress()
  }, [address, currentBlock, contract, releaseTime, setState])

  return state
}

export default useGetPublicIfoData
