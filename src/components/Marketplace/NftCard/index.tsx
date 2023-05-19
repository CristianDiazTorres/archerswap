import React from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { CardActionArea } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CustomImg from '../CustomImg/CustomImg'

const NftCardWrap = styled.div`
  background: ${({ theme }) => theme.colors.card};

  span,
  a,
  p {
    color: ${({ theme }) => theme.colors.text};
  }
`

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background} !important;
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
`

const MarketCard = ({
  tabType = 'All',
  tokenHighestBids = [],
  latestSoldTokens = [],
  collectionInfo,
  token,
  tokenListing,
  isMyNFT,
}: any) => {
  return (
    <NftCardWrap>
      <Link to={`/marketplace/${collectionInfo.alias}/${token.tokenId}`}>
        <StyledCard
          sx={{
            boxShadow: '0px 6px 20px rgba(67, 86, 134, 0.1)',
          }}
        >
          <CardActionArea>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                pt: '100%',
              }}
            >
              <CustomImg src={token?.thumbnailCdnUrl || ''} />
            </Box>

            <CardContent sx={{ flexGrow: 1, py: '8px' }}>
              <Typography mb="5px" sx={{ fontSize: '12px', color: '#858585' }}>
                Token ID #{token?.tokenId || ''}
              </Typography>
              <Typography mb="5px" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                {collectionInfo?.name || ''}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Typography sx={{ fontSize: '12px', color: '#666666' }}>Rarity rank</Typography>
                </Box>
                <Typography sx={{ fontSize: '12px', color: '#666666' }}># {token?.rarityRank || 0}</Typography>
              </Box>
            </CardContent>
            <Divider />
            {!isMyNFT ? (
              <CardContent sx={{ flexGrow: 1, pt: '8px', pb: '5px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                    {(tabType === 'All' || tabType === 'Listing') && 'Price'}
                    {tabType === 'Offers' && 'Highest bid'}
                    {tabType === 'Sold' && 'Last sell'}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {(tabType === 'All' || tabType === 'Listing') && (
                      <Typography sx={{ fontSize: '14px', color: '#333333' }}>
                        {new BigNumber(
                          tokenListing.find((t: any) => t.tokenId.toString(10) === token.tokenId)?.value.toString(10) ||
                            0,
                        ).isZero()
                          ? 'Not for sale'
                          : new BigNumber(
                              tokenListing
                                .find((t: any) => t.tokenId.toString(10) === token.tokenId)
                                ?.value.toString(10) || 0,
                            )
                              .div(10 ** 18)
                              .toString(10)}
                      </Typography>
                    )}
                    {tabType === 'Offers' && (
                      <Typography sx={{ fontSize: '14px', color: '#333333' }}>
                        {new BigNumber(
                          tokenHighestBids
                            .find((t: any) => t.tokenId.toString(10) === token.tokenId)
                            ?.value.toString(10) || 0,
                        )
                          .div(10 ** 18)
                          .toString(10)}
                      </Typography>
                    )}
                    {tabType === 'Sold' && (
                      <Typography sx={{ fontSize: '14px', color: '#333333' }}>
                        {new BigNumber(
                          latestSoldTokens.find((t: any) => t.tokenId.toString(10) === token.tokenId)?.valueNum || 0,
                        ).toString(10)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  mb: '5px',
                }}
              >
                <Link to={`/marketplace/${collectionInfo.alias}/${token.tokenId}`}>
                  <Button>List</Button>
                </Link>
                <Link to={`/marketplace/${collectionInfo.alias}/${token.tokenId}?transfer=Open`}>
                  <Button>Transfer</Button>
                </Link>
              </Box>
            )}
          </CardActionArea>
        </StyledCard>
      </Link>
    </NftCardWrap>
  )
}

export default MarketCard
