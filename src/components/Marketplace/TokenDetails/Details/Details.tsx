import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Button as StyledButton } from 'archerswap-uikit'
import ButtonGroup from '@mui/material/ButtonGroup'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { useTokenListing, useBuyToken, useDelistToken, useGetBidderTokenBid } from 'hooks/useNftMarketplace'
import { useETHBalance, useWcoreBalance } from 'hooks/useTokenBalance'
import CountTimeDown from 'components/Marketplace/CountTimeDown/CountTimeDown'
import TokenListing from '../TokenListing/TokenListing'
import TokenTransfer from '../TokenTransfer/TokenTransfer'
import TokenPlaceBid from '../TokenPlaceBid/TokenPlaceBid'

const DetailWrap = styled(Box)`
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
  padding: 24px 32px;

  span,
  a,
  p,
  h1,
  div,
  .MuiStepLabel-label {
    color: ${({ theme }) => theme.colors.text} !important;
  }
  .MuiButton-root {
    background: ${({ theme }) => theme.colors.backgroundDisabled};
    padding: 4px 12px;
    border-radius: 50px;
  }

  input {
    background: ${({ theme }) => theme.colors.background};
  }
`

const StyledActionBtn = styled(StyledButton)`
  width: 50%;
  color: white !important;
`

const TraitButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text} !important;
`

const StyledIconWrapper = styled.a`
  background: ${({ theme }) => theme.colors.primary};
  width: 32px;
  height: 32px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const getEllipsis = (str) => {
  return `${str.slice(0, 6)}...${str.slice(-4)}`
}

const Details = ({
  collectionInfo,
  tokenInfo,
  attributeInfo,
  tokenOwner,
  priceData,
  serviceFee,
  royalty,
  isWithdrawBid,
  onPlaceBid,
}: any) => {
  const [isList, setIsList] = useState(false)
  const [isTransfer, setIsTransfer] = useState(false)
  const [isPlaceBid, setIsPlaceBid] = useState(false)
  const [options, setOptions] = useState([])
  const [isExpired, setIsExpired] = useState(false)
  const { account } = useWeb3React()

  const coreBalance = useETHBalance()
  const wcoreBalance = useWcoreBalance()

  const [isLoading, buyToken] = useBuyToken()
  const [isDelistLoading, isDelisted, deListToken] = useDelistToken()
  const listedTokenInfo: any = useTokenListing(
    collectionInfo?.address,
    tokenInfo.tokenId,
    isLoading || isList || isDelisted || isTransfer || isPlaceBid,
  )
  const [tokenBidder, getBidderTokenBid]: any = useGetBidderTokenBid()

  useEffect(() => {
    getBidderTokenBid(collectionInfo?.address, tokenInfo.tokenId)
  }, [collectionInfo, tokenInfo, account, isPlaceBid, isWithdrawBid, getBidderTokenBid])

  useEffect(() => {
    if (window.location.search) {
      const queryParams = new URLSearchParams(window.location.search)
      if (queryParams.get('transfer')) {
        setIsTransfer(true)
      }
    }
  }, [])

  useEffect(() => {
    if (collectionInfo && attributeInfo && attributeInfo.attributeCategories) {
      const _options: any = []
      const totalSupply = collectionInfo.totalSupply
      attributeInfo.attributeCategories.map((attr: any) => {
        _options.push({
          label: attr.type,
          select: [
            ...attr.values.map((v: any) => ({
              label: v.value,
              amount: v.count,
              percentage: new BigNumber(v.count).div(totalSupply).times(100).dp(2, 1).toString(),
            })),
          ],
        })
        return true
      })
      setOptions(_options)
    }
  }, [collectionInfo, attributeInfo])

  const handleListingExpired = () => {
    setIsExpired(true)
  }

  const getTraitCount = (trait: any) => {
    if (tokenInfo && tokenInfo.attributes) {
      const index = tokenInfo.attributes.findIndex((a: any) => a.trait_type === trait.label)
      if (index !== -1) {
        return tokenInfo.attributes[index].value
      }
      return ''
    }
    return ''
  }

  const getTraitPercent = (trait: any) => {
    if (tokenInfo && tokenInfo.attributes) {
      const index = tokenInfo.attributes.findIndex((t: any) => t.trait_type.toLowerCase() === trait.label.toLowerCase())
      if (index !== -1 && trait && trait.select) {
        const _attributeIndex = trait.select.findIndex((a: any) => a.label === tokenInfo.attributes[index].value)
        if (_attributeIndex !== -1) {
          return trait.select[_attributeIndex].percentage
        }
        return 0
      }
      return 0
    }
    return 0
  }

  const handleBuyToken = () => {
    if (collectionInfo.address && tokenInfo.tokenId) {
      const amount: any = new BigNumber(listedTokenInfo.value).div(10 ** 18).toString(10)
      buyToken(amount, collectionInfo.address, tokenInfo.tokenId)
    }
  }

  const handleDelist = () => {
    if (collectionInfo.address && tokenInfo.tokenId) {
      deListToken(collectionInfo.address, tokenInfo.tokenId)
    }
  }
  return (
    <DetailWrap>
      {isList && (
        <TokenListing
          collectionInfo={collectionInfo}
          tokenInfo={tokenInfo}
          serviceFee={serviceFee}
          royalty={royalty}
          onCancel={() => setIsList(false)}
        />
      )}
      {isTransfer && (
        <TokenTransfer
          account={account || ''}
          collectionInfo={collectionInfo}
          tokenInfo={tokenInfo}
          onCancel={() => setIsTransfer(false)}
        />
      )}
      {isPlaceBid && (
        <TokenPlaceBid
          coreBalance={coreBalance.div(10 ** 18).toString()}
          wcoreBalance={wcoreBalance.div(10 ** 18).toString()}
          collectionInfo={collectionInfo}
          tokenInfo={tokenInfo}
          onCancel={() => setIsPlaceBid(false)}
          onPlaceBid={onPlaceBid}
        />
      )}
      {!isList && !isTransfer && !isPlaceBid && (
        <Box>
          <Typography variant="h1" sx={{ fontSize: '24px', fontWeight: 600, mb: '20px' }}>
            {tokenInfo?.name || ''}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              mb: '15px',
            }}
          >
            <img src="/images/nfts/marketplace/traits.svg" alt="traits" />
            Traits
          </Box>
          <Box display="flex" gap="15px" sx={{ flexWrap: 'wrap', mb: '25px' }}>
            {options.map((trait: any, idx: any) => (
              <ButtonGroup
                variant="text"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  p: '8px 16px',
                  borderRadius: '50px',
                }}
                key={trait.label}
              >
                <TraitButton
                  sx={{
                    color: 'common.black',
                    flexDirection: 'column',
                    p: '0',
                    pr: '10px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {trait.label} : {getTraitCount(trait)}
                </TraitButton>
                <TraitButton
                  sx={{
                    color: 'common.black',
                    flexDirection: 'column',
                    p: '0',
                    pl: '10px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {getTraitPercent(trait)}%
                </TraitButton>
              </ButtonGroup>
            ))}
          </Box>

          <Box
            sx={{
              mb: '20px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {tokenOwner === account && (
              <Typography sx={{ fontSize: '14px' }}>
                Owned by you |{' '}
                <strong style={{ cursor: 'pointer' }} onClick={() => setIsTransfer(true)} role="presentation">
                  Transfer
                </strong>
              </Typography>
            )}
            {tokenOwner !== account && <Typography sx={{ fontSize: '14px' }}>Owned by</Typography>}
            {tokenOwner !== account && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Typography sx={{ fontSize: '14px' }}>{getEllipsis(tokenOwner || '')}</Typography>
                <StyledIconWrapper
                  href={`https://scan.coredao.org/address/${tokenOwner}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src="/images/nfts/marketplace/scan.svg" alt="scan" />
                </StyledIconWrapper>
              </Box>
            )}
          </Box>
          <Divider />
          <Box
            sx={{
              mt: '35px',
              mb: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Typography>Rarity rank: {tokenInfo.rarityRank || ''}</Typography>
          </Box>
          {!new BigNumber(listedTokenInfo.value).isZero() &&
            !new BigNumber(listedTokenInfo.expireTimestamp).isZero() &&
            !isExpired && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: '30px',
                }}
              >
                <Typography sx={{ fontSize: '14px' }}>sell price</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        color: '#EF5DA8',
                        fontWeight: '700',
                      }}
                    >
                      {new BigNumber(listedTokenInfo?.value || 0).div(10 ** 18).toString(10)} CORE
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#4D4D4D',
                      p: '4px 15px',
                      borderRadius: '50px',
                    }}
                  >
                    $
                    {new BigNumber(listedTokenInfo?.value || 0)
                      .div(10 ** 18)
                      .times(priceData || 0)
                      .dp(2, 1)
                      .toString()}
                  </Typography>
                </Box>
              </Box>
            )}
          {!new BigNumber(listedTokenInfo.expireTimestamp).isZero() && !isExpired && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '18px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#666666' }}>Sale ends in</Typography>
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <CountTimeDown timestamp={listedTokenInfo?.expireTimestamp || 0} onExpired={handleListingExpired} />
              </Box>
            </Box>
          )}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontSize: '14px', color: '#333333', fontWeight: 500 }}>Market Status</Typography>
              <Typography sx={{ fontSize: '14px', color: '#333333', fontWeight: 600 }}>
                {!new BigNumber(listedTokenInfo.value || 0).isZero() ? 'For sale' : 'Not for Sale'}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '18px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#666666' }}>Service Fee:</Typography>
              <Typography sx={{ fontSize: '12px', color: '#666666' }}>{serviceFee}%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '24px' }}>
            {tokenOwner !== account && (
              <StyledActionBtn onClick={() => setIsPlaceBid(true)}>
                {new BigNumber(tokenBidder.value || 0).isZero() ? 'Place a bid' : 'Update bid price'}
              </StyledActionBtn>
            )}
            {tokenOwner === account && (
              <StyledActionBtn onClick={() => setIsList(true)}>
                {new BigNumber(listedTokenInfo.value).isZero() ? 'List onto market' : 'Change sell price'}
              </StyledActionBtn>
            )}
            {tokenOwner === account && !new BigNumber(listedTokenInfo.value).isZero() && (
              <StyledActionBtn
                disabled={!collectionInfo.address || tokenInfo.tokenId === undefined}
                onClick={handleDelist}
              >
                {isDelistLoading && (
                  <CircularProgress
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 6,
                      color: 'red',
                    }}
                    color="secondary"
                  />
                )}
                Remove from market
              </StyledActionBtn>
            )}
            {tokenOwner !== account && !new BigNumber(listedTokenInfo.value).isZero() && !isExpired && (
              <StyledActionBtn
                variant="primary"
                disabled={!collectionInfo.address || tokenInfo.tokenId === undefined}
                onClick={handleBuyToken}
              >
                {isLoading && (
                  <CircularProgress
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 6,
                      color: 'red',
                    }}
                    color="secondary"
                  />
                )}
                Buy now
              </StyledActionBtn>
            )}
          </Box>
        </Box>
      )}
    </DetailWrap>
  )
}

export default Details
