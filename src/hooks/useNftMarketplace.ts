import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import multicall from 'utils/multicall'
import nftMarketplaceABI from 'config/abi/nftMarketplace.json'
import erc721ABI from 'config/abi/erc721.json'
import { getNftMarketplaceAddress } from 'utils/addressHelpers'
import { useWcore, useERC721, useMarketplace } from './useContract'

// GET Listed Tokens

export const useNumTokenListings = (erc721Address: string) => {
  const [data, setData] = useState(0)
  // const { account } = useWeb3React()
  const marketplaceContract = useMarketplace()

  const getTokenListings = useCallback(async () => {
    const res = await marketplaceContract.methods.numTokenListings(erc721Address).call()
    setData(res)
  }, [marketplaceContract, erc721Address])

  useEffect(() => {
    if (erc721Address) {
      getTokenListings()
    }
  }, [erc721Address, getTokenListings])

  return data
}

export const useTokenListings = (erc721Address: string, total: any) => {
  const [data, setData] = useState<any>([])

  const getTokenListings = useCallback(async () => {
    const _tokenListing: any = []
    const _multicallMethods = []
    for (let i = 0; i < total; i += 128) {
      _multicallMethods.push({
        address: getNftMarketplaceAddress(),
        name: 'getTokenListings',
        params: [erc721Address, i, 128],
      })
    }
    const multicallData = await multicall(nftMarketplaceABI, _multicallMethods)
    multicallData.map((t: any) => {
      _tokenListing.push(...t[0].filter((r: any) => !new BigNumber(r.value).isZero()))
      return true
    })

    setData([..._tokenListing])
  }, [erc721Address, total])

  useEffect(() => {
    if (erc721Address && total) {
      getTokenListings()
    }
  }, [erc721Address, total, getTokenListings])

  return data
}

// Get Listed Token Info
export const useTokenListing = (erc721Address: string, tokenId: any, isLoading: any) => {
  const [data, setData] = useState<any>({})
  const marketplaceContract = useMarketplace()

  const getTokenListing = useCallback(async () => {
    const res: any = await marketplaceContract.methods.getTokenListing(erc721Address, tokenId).call()
    setData(res)
  }, [marketplaceContract, erc721Address, tokenId])

  useEffect(() => {
    if (erc721Address && tokenId !== undefined) {
      getTokenListing()
    }
  }, [erc721Address, tokenId, isLoading, getTokenListing])

  return data
}

// Get My NFT Tokens

export const useGetMyTokenIds = (erc721Address: string, isShowMyNft: string) => {
  const { account } = useWeb3React()
  const [data, setData] = useState<any>([])
  const nftTokenContract = useERC721(erc721Address)

  useEffect(() => {
    const getMyTokenIds = async () => {
      const balance: any = await nftTokenContract.methods.balanceOf(account).call()
      const _multicallMethods = []
      for (let i = 0; i < +balance; i++) {
        _multicallMethods.push({
          address: erc721Address,
          name: 'tokenOfOwnerByIndex',
          params: [account, i],
        })
      }
      const multicallData = await multicall(erc721ABI, _multicallMethods)
      setData(multicallData.map((id) => id.toString(10)))
    }
    if (nftTokenContract && erc721Address && isShowMyNft === 'on') {
      getMyTokenIds()
    }
  }, [account, nftTokenContract, erc721Address, isShowMyNft])

  return data
}

// GET tokens which got offer

export const useNumTokenWithBids = () => {
  const [data, setData] = useState(0)
  const marketplaceContract = useMarketplace()

  const getTokenWithBids = useCallback(
    async (erc721Address: string) => {
      if (erc721Address) {
        const res = await marketplaceContract.methods.numTokenWithBids(erc721Address).call()
        setData(res)
      }
    },
    [marketplaceContract],
  )

  return [data, getTokenWithBids]
}

export const useTokenHighestBids = () => {
  const [data, setData] = useState<any>([])

  const getTokenHighestBids = useCallback(async (erc721Address: any, total: any) => {
    if (erc721Address && total) {
      const _tokenHighestBids: any = []
      const _multicallMethods = []
      for (let i = 0; i < total; i += 64) {
        _multicallMethods.push({
          address: getNftMarketplaceAddress(),
          name: 'getTokenHighestBids',
          params: [erc721Address, i, 128],
        })
      }
      const multicallData = await multicall(nftMarketplaceABI, _multicallMethods)

      multicallData.map((t: any) => {
        _tokenHighestBids.push(...t[0].filter((r: any) => !new BigNumber(r.value).isZero()))
        return true
      })

      setData([..._tokenHighestBids])
    }
  }, [])

  return [data, getTokenHighestBids]
}

// Get Token owner address

export const useGetOwnerOfToken = (erc721Address: string) => {
  const [data, setData] = useState<any>('')

  const nftTokenContract = useERC721(erc721Address)

  const getOwnerOfToken = useCallback(
    async (tokenId: string) => {
      if (nftTokenContract && tokenId !== undefined) {
        const res: any = await nftTokenContract.methods.ownerOf(tokenId).call()
        setData(res)
      }
    },
    [nftTokenContract],
  )

  return [data, getOwnerOfToken]
}
// Get My NFTs Collections
export const useGetMyCollections = (collections: any = []) => {
  const [data, setData] = useState([])
  const { account } = useWeb3React()

  const getMyCollections = useCallback(async () => {
    if (!account) return
    const _multicallMethods = []
    collections.map(async (collection: any) => {
      _multicallMethods.push({
        address: collection.address,
        name: 'balanceOf',
        params: [account],
      })
    })

    const multicallData = await multicall(erc721ABI, _multicallMethods)

    setData(
      collections
        .map((c: any, idx: any) => {
          return { ...c, balance: multicallData[idx].toString(10) }
        })
        .filter((_: any, idx: any) => !new BigNumber(multicallData[idx]).isZero()),
    )
  }, [account, collections])

  useEffect(() => {
    getMyCollections()
  }, [getMyCollections])

  return data
}

// GET Service Fee
export const useGetServiceFee = () => {
  const [data, setData] = useState(0)
  const marketplaceContract = useMarketplace()

  const getServiceFee = useCallback(async () => {
    const res = await marketplaceContract.methods.serviceFee().call()
    setData(new BigNumber(((res || 0) * 100) / 1000).toNumber())
  }, [marketplaceContract])

  useEffect(() => {
    getServiceFee()
  }, [getServiceFee])

  return data
}

// GET royalty
export const useGetRoyalty = (erc721Address: string) => {
  const [data, setData] = useState(0)
  const marketplaceContract = useMarketplace()

  const getRoyalty = useCallback(async () => {
    const res = await marketplaceContract.methods.royalty(erc721Address).call()
    setData(new BigNumber((res.feeFraction * 100) / 1000).toNumber())
  }, [erc721Address, marketplaceContract])

  useEffect(() => {
    if (erc721Address) {
      getRoyalty()
    }
  }, [erc721Address, getRoyalty])

  return data
}

// Get Token Bids

export const useGetTokenBids = () => {
  const [data, setData] = useState([])
  const marketplaceContract = useMarketplace()

  const getTokenBids = useCallback(
    async (erc721Address: string, tokenId: any) => {
      if (erc721Address && tokenId !== undefined) {
        const res = await marketplaceContract.methods.getTokenBids(erc721Address, tokenId).call()
        setData((res || []).filter((r: any) => r.bidder !== '0x0000000000000000000000000000000000000000'))
      }
    },
    [marketplaceContract],
  )

  return [data, getTokenBids]
}

// Get BidderToken

export const useGetBidderTokenBid = () => {
  const [data, setData] = useState<any>({})
  const { account } = useWeb3React()
  const marketplaceContract = useMarketplace()

  const getBidderTokenBid = useCallback(
    async (erc721Address: any, tokenId: any) => {
      if (erc721Address && tokenId !== undefined && account) {
        const res: any = await marketplaceContract.methods.getBidderTokenBid(erc721Address, tokenId, account).call()
        setData(res)
      }
    },
    [account, marketplaceContract],
  )

  return [data, getBidderTokenBid]
}

// Withdraw Bid Token
export const useWithdrawBidToken = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isWithdrawBid, setIsWithdrawBid] = useState<any>(false)
  const marketplaceContract = useMarketplace()

  const { account } = useWeb3React()

  const withdrawBidToken = useCallback(
    async (erc721Address: string, tokenId: string) => {
      try {
        setIsLoading(true)
        const tx = await marketplaceContract.methods.withdrawBidForToken(erc721Address, tokenId).send({ from: account })
        setIsLoading(false)
        if (tx) {
          setIsWithdrawBid(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [marketplaceContract, account],
  )

  return [isLoading, isWithdrawBid, withdrawBidToken]
}

// Accept Bid Token
export const useAcceptBidToken = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isAcceptBid, setIsAcceptBid] = useState<any>(false)
  const marketplaceContract = useMarketplace()

  const { account } = useWeb3React()

  const acceptBidToken = useCallback(
    async (erc721Address: string, tokenId: string, bidder: string, value: string) => {
      try {
        setIsLoading(true)
        const tx = await marketplaceContract.methods
          .acceptBidForToken(erc721Address, tokenId, bidder, value)
          .send({ from: account })
        setIsLoading(false)
        if (tx) {
          setIsAcceptBid(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [marketplaceContract, account],
  )

  return [isLoading, isAcceptBid, acceptBidToken]
}

export const useGetIsApprovedForAll = (erc721Address: any) => {
  const [data, setData] = useState<any>(false)
  const nftTokenContract = useERC721(erc721Address)
  const { account } = useWeb3React()

  const getIsApprovedForAll = useCallback(async () => {
    if (nftTokenContract) {
      const res: any = await nftTokenContract.methods.isApprovedForAll(account, getNftMarketplaceAddress()).call()
      setData(res)
    }
  }, [account, nftTokenContract])
  return [data, getIsApprovedForAll]
}

// Get Approve
export const useApproveNFT = (erc721Address: string) => {
  const [isLoading, setIsLoading] = useState<any>(false)

  const { account } = useWeb3React()
  const nftTokenContract = useERC721(erc721Address)

  const approveNFT = useCallback(async () => {
    if (!account) return false
    try {
      setIsLoading(true)
      const options = {
        from: account,
      }
      const tx = await nftTokenContract.methods.setApprovalForAll(getNftMarketplaceAddress(), true).send(options)
      setIsLoading(false)
      return tx
    } catch (e) {
      setIsLoading(false)
      return false
    }
  }, [nftTokenContract, account])

  return [isLoading, approveNFT]
}

// List token
export const useListToken = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isListed, setIsListed] = useState<any>(false)
  const marketplaceContract = useMarketplace()

  const { account } = useWeb3React()

  const listToken = useCallback(
    async (erc721Address: string, tokenId: string, price: any, expireTimestamp: any) => {
      try {
        setIsLoading(true)
        const tx = await marketplaceContract.methods
          .listToken(erc721Address, tokenId, new BigNumber(price).times(10 ** 18).toString(10), expireTimestamp)
          .send({ from: account })
        setIsLoading(false)
        if (tx) {
          setIsListed(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [marketplaceContract, account],
  )

  return [isLoading, isListed, listToken]
}

// Get WCORE Allowance
export const useGetAllowanceWCORE = () => {
  const [isAllowed, setIsAllowed] = useState<any>(false)
  const tokenContract = useWcore()
  const { account } = useWeb3React()

  const getAllowanceWCORE = useCallback(async () => {
    const allowance = await tokenContract.methods.allowance(account, getNftMarketplaceAddress()).call()
    if (!new BigNumber(allowance).isZero()) {
      setIsAllowed(true)
    }
  }, [account, tokenContract])

  useEffect(() => {
    if (account) {
      getAllowanceWCORE()
    }
  }, [account, getAllowanceWCORE])

  return [isAllowed]
}

// Convert CORE to WCORE
export const useConvertToWCORE = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isConverted, setIsConverted] = useState<any>(false)

  const tokenContract = useWcore()
  const { account } = useWeb3React()

  const convertToWCORE = useCallback(
    async (amount: any) => {
      try {
        setIsLoading(true)
        const options = {
          from: account,
          value: new BigNumber(amount).times(10 ** 18).toString(10),
        }
        const tx = await tokenContract.methods.deposit().send(options)
        setIsLoading(false)
        if (tx) {
          setIsConverted(true)
        }
        return tx
      } catch (e) {
        console.log('e', e)
        setIsLoading(false)
        return false
      }
    },
    [tokenContract, account],
  )

  return [isLoading, isConverted, convertToWCORE]
}

// Approve WCORE
export const useApproveWCORE = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isWcoreApproved, setIsWcoreApproved] = useState<any>(false)

  const tokenContract = useWcore()
  const { account } = useWeb3React()

  const approveWCORE = useCallback(
    async (amount: any) => {
      try {
        setIsLoading(true)
        const options = {
          from: account,
        }
        const tx = await tokenContract.methods
          .approve(getNftMarketplaceAddress(), ethers.constants.MaxUint256)
          .send(options)
        setIsLoading(false)
        if (tx) {
          setIsWcoreApproved(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [tokenContract, account],
  )

  return [isLoading, isWcoreApproved, approveWCORE]
}

// Bid to token
export const useBidToken = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isPlaceBid, setIsPlaceBid] = useState<any>(false)
  const marketplaceContract = useMarketplace()

  const { account } = useWeb3React()

  const bidToken = useCallback(
    async (erc721Address: string, tokenId: string, price: any, expireTimestamp: any) => {
      try {
        setIsLoading(true)
        const tx = await marketplaceContract.methods
          .enterBidForToken(erc721Address, tokenId, new BigNumber(price).times(10 ** 18).toString(10), expireTimestamp)
          .send({ from: account })
        setIsLoading(false)
        if (tx) {
          setIsPlaceBid(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [marketplaceContract, account],
  )

  return [isLoading, isPlaceBid, bidToken]
}

// Buy Token
export const useBuyToken = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const marketplaceContract = useMarketplace()

  const { account } = useWeb3React()

  const buyToken = useCallback(
    async (amount: any, erc721Address: string, tokenId: string) => {
      if (!account) return false
      try {
        setIsLoading(true)
        const _amount = new BigNumber(amount).times(10 ** 18).toString(10)
        const options = {
          from: account,
          value: _amount,
        }
        const tx = await marketplaceContract.methods.buyToken(erc721Address, tokenId).send(options)
        setIsLoading(false)
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [marketplaceContract, account],
  )

  return [isLoading, buyToken]
}

// Delist token
export const useDelistToken = () => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isDelisted, setIsDelisted] = useState<any>(false)
  const marketplaceContract = useMarketplace()

  const { account } = useWeb3React()

  const deListToken = useCallback(
    async (erc721Address: string, tokenId: string) => {
      try {
        setIsLoading(true)
        const tx = await marketplaceContract.methods.delistToken(erc721Address, tokenId).send({ from: account })
        setIsLoading(false)
        if (tx) {
          setIsDelisted(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [marketplaceContract, account],
  )

  return [isLoading, isDelisted, deListToken]
}

// Transfer token
export const useTransferToken = (erc721Address: string) => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [isTransferred, setTransferred] = useState<any>(false)

  const { account } = useWeb3React()
  const nftTokenContract = useERC721(erc721Address)

  const transferToken = useCallback(
    async (from: string, to: string, tokenId: string) => {
      try {
        setIsLoading(true)
        const tx = await nftTokenContract.methods.safeTransferFrom(from, to, tokenId).send({ from: account })
        setIsLoading(false)
        if (tx) {
          setTransferred(true)
        }
        return tx
      } catch (e) {
        setIsLoading(false)
        return false
      }
    },
    [nftTokenContract, account],
  )

  return [isLoading, isTransferred, transferToken]
}
