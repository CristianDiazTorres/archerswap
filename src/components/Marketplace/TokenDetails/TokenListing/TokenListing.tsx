import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useGetIsApprovedForAll, useApproveNFT, useListToken } from 'hooks/useNftMarketplace'
import { usePriceCoreUsd } from 'state/hooks'
import { StyledSearch, SearchIconWrapper, StyledInputBase } from './styles'

const TokenListingContainer = styled(Box)`
  .expiry-item {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`

const ExpiryTimes = [
  {
    label: '3 days',
    days: 3,
  },
  {
    label: '7 days',
    days: 7,
  },
  {
    label: '30 days',
    days: 30,
  },
  {
    label: '6 months',
    days: 180,
  },
]

const TokenListing = ({ collectionInfo, tokenInfo, serviceFee, royalty, onCancel }: any) => {
  const [steps, setSteps] = useState<any>(['Sell price', 'Approve', 'Sign'])
  const [activeStep, setActiveStep] = useState(0)
  const [listingPrice, setListingPrice] = useState(0)
  const [expiryDays, setExpiryDays] = useState(3)

  const [isLoading, approveNFT] = useApproveNFT(collectionInfo?.address)
  const [isApproved, getIsApprovedForAll] = useGetIsApprovedForAll(collectionInfo?.address)
  const [isListingLoading, isListed, listToken] = useListToken()
  const priceData: any = usePriceCoreUsd()

  useEffect(() => {
    if (activeStep === 0 && isApproved && steps.length === 3) {
      setSteps(['Sell price', 'Sign'])
    }
  }, [activeStep, isApproved, steps])

  useEffect(() => {
    if (activeStep === 1 && isApproved && steps.length === 3) {
      setActiveStep(2)
    }
  }, [activeStep, isApproved, steps])

  useEffect(() => {
    getIsApprovedForAll()
  }, [isLoading, getIsApprovedForAll])

  const handleStep = () => {
    if ((activeStep === 0 || activeStep === 1) && !isApproved) {
      setActiveStep(1)
      approveNFT()
    }
    if (activeStep === 0 && isApproved) {
      setActiveStep(1)
    }
    if ((activeStep === 2 && !isListed) || (activeStep === 1 && isApproved && !isListed)) {
      listToken(
        collectionInfo?.address,
        tokenInfo.tokenId,
        new BigNumber(listingPrice).toString(10),
        moment().add('days', expiryDays).unix(),
      )
    }
    if ((activeStep === 2 && isListed) || (activeStep === 1 && isApproved && isListed)) {
      onCancel()
    }
  }
  const handleInputPrice = (v: any) => {
    setListingPrice(v.target.value || 0)
  }

  return (
    <TokenListingContainer>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h1"
          style={{
            fontSize: 24,
          }}
        >
          List onto market
        </Typography>
        <Typography
          variant="h1"
          style={{
            fontSize: 16,
            cursor: 'pointer',
          }}
          onClick={onCancel}
        >
          {isListed ? 'Done' : 'Cancel'}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          padding: '24px 4px',
          marginTop: '24px',
          borderRadius: '12px',
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label: any) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Box>
      <Box
        style={{
          marginTop: '32px',
        }}
      >
        <Typography
          variant="h1"
          style={{
            fontSize: 24,
          }}
        >
          {activeStep === 0 && 'Sell Price'}
          {activeStep === 1 && !isApproved && 'Approve'}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && !isListingLoading && !isListed && 'Sign'}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) &&
            isListingLoading &&
            !isListed &&
            'Listing in progress'}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && isListed && 'Successfully listed!'}
        </Typography>
        <Typography
          variant="h1"
          style={{
            fontSize: 16,
            marginTop: '32px',
          }}
        >
          {activeStep === 0 && 'Enter price in CORE for this NFT'}
          {activeStep === 1 && !isApproved && 'Perform this with your wallet'}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) &&
            !isListingLoading &&
            !isListed &&
            'Set your sale listing expiry time'}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) &&
            isListingLoading &&
            !isListed &&
            'Please wait while we confirm your listing'}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) &&
            isListed &&
            isListed &&
            `Your NFT is now listed for ${listingPrice} CORE`}
        </Typography>
        <Box
          style={{
            marginTop: '24px',
          }}
        >
          {activeStep === 0 && (
            <StyledSearch>
              <StyledInputBase type="number" placeholder="0.0" onChange={handleInputPrice} />
              <SearchIconWrapper>CORE</SearchIconWrapper>
            </StyledSearch>
          )}
          {activeStep === 1 && !isApproved && (
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              Awaiting your approval to list your NFTs
            </Typography>
          )}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && !isListingLoading && !isListed && (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 32,
              }}
            >
              {ExpiryTimes.map((expiry: any) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    padding: '10px',
                    borderRadius: 32,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: expiryDays === expiry.days ? '#3960C1' : '',
                  }}
                  key={expiry.label}
                  onClick={() => setExpiryDays(expiry.days)}
                  role="presentation"
                >
                  {expiry.label}
                </div>
              ))}
            </Box>
          )}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && !isListingLoading && !isListed && (
            <Typography
              style={{
                fontSize: 14,
                marginTop: 24,
              }}
            >
              Your listing will expire on {moment().add('days', expiryDays).format('LLL')}
            </Typography>
          )}
        </Box>
        <Box
          style={{
            marginTop: '24px',
          }}
        >
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && !isListingLoading && !isListed && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              Your listing price is {listingPrice} CORE($
              {new BigNumber(listingPrice || 0)
                .times(priceData || 0)
                .dp(2, 1)
                .toString()}
              )
            </Typography>
          )}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && isListed && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              Your NFT is now for sale on the marketplace. The NFT still remains in your wallet
            </Typography>
          )}
          {(activeStep === 2 || (activeStep === 1 && isApproved)) && isListingLoading && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              Your NFT is being listed on the marketplace
            </Typography>
          )}
          <Button
            sx={{ width: '100%', py: '12px', backgroundColor: '#3960C1' }}
            variant="contained"
            color="secondary"
            disableElevation
            disabled={activeStep === 0 && new BigNumber(listingPrice || 0).isLessThanOrEqualTo(0)}
            onClick={handleStep}
          >
            {activeStep === 0 && 'Next Step'}
            {activeStep === 1 && !isApproved && (
              <>
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
                {isLoading ? 'Pending approval' : 'Approve'}
              </>
            )}
            {(activeStep === 2 || (activeStep === 1 && isApproved)) && !isListed && (
              <>
                {isListingLoading && (
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
                {isListingLoading ? 'Pending confirmation' : 'List NFT for sale'}
              </>
            )}
            {(activeStep === 2 || (activeStep === 1 && isApproved)) && isListed && 'Done'}
          </Button>
        </Box>
        {activeStep === 0 && (
          <Box
            style={{
              marginTop: '24px',
            }}
          >
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              Once sold, the following fees will be deducted:
            </Typography>
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              {serviceFee}% service fee | {royalty}% creator royalty | You get approx{' '}
              {new BigNumber(
                listingPrice -
                  listingPrice * (+serviceFee / 100) -
                  (listingPrice - listingPrice * (+serviceFee / 100)) * (+royalty / 100),
              )
                .dp(2, 1)
                .toString(10)}{' '}
              CORE
            </Typography>
          </Box>
        )}
      </Box>
    </TokenListingContainer>
  )
}

export default TokenListing
