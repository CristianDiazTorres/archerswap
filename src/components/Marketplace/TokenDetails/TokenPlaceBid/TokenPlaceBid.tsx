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
import { useGetAllowanceWCORE, useConvertToWCORE, useApproveWCORE, useBidToken } from 'hooks/useNftMarketplace'
import { StyledSearch, SearchIconWrapper, StyledInputBase } from './styles'

const TokenPlaceBidContainer = styled(Box)`
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

const TokenPlaceBid = ({ collectionInfo, tokenInfo, coreBalance, wcoreBalance, onCancel, onPlaceBid }: any) => {
  const [steps, setSteps] = useState(['Bid amount', 'Convert', 'Approve', 'Sign'])
  const [activeStep, setActiveStep] = useState(0)
  const [bidAmount, setBidAmount] = useState(0)
  const [expiryDays, setExpiryDays] = useState(3)

  const [isAllowedWCORE] = useGetAllowanceWCORE()
  const [isConvertLoading, isConverted, convertToWCORE] = useConvertToWCORE()
  const [isApproveLoading, isWcoreApproved, approveWCORE] = useApproveWCORE()
  const [isBidLoading, isPlaceBid, bidToken] = useBidToken()

  useEffect(() => {
    if (isConverted) {
      setActiveStep(!isAllowedWCORE ? steps.length - 2 : steps.length - 1)
    }
  }, [isConverted, isAllowedWCORE, steps])

  useEffect(() => {
    if (isWcoreApproved) {
      setActiveStep(steps.length - 1)
    }
  }, [isWcoreApproved, steps])

  useEffect(() => {
    if (isPlaceBid) {
      onPlaceBid()
    }
  }, [isPlaceBid, onPlaceBid])

  useEffect(() => {
    if (new BigNumber(bidAmount).isGreaterThan(wcoreBalance)) {
      setSteps(!isAllowedWCORE ? ['Bid amount', 'Convert', 'Approve', 'Sign'] : ['Bid amount', 'Convert', 'Sign'])
    } else {
      setSteps(!isAllowedWCORE ? ['Bid amount', 'Approve', 'Sign'] : ['Bid amount', 'Sign'])
    }
  }, [bidAmount, isAllowedWCORE, wcoreBalance])

  const handleStep = () => {
    if (activeStep === 0) {
      setActiveStep(1)
    }

    if (steps[activeStep] === 'Convert') {
      convertToWCORE(new BigNumber(bidAmount).minus(wcoreBalance).toString(10))
    }
    if (steps[activeStep] === 'Approve') {
      approveWCORE()
    }
    if (steps[activeStep] === 'Sign' && !isPlaceBid) {
      bidToken(
        collectionInfo?.address,
        tokenInfo.tokenId,
        new BigNumber(bidAmount).toString(10),
        moment().add('days', expiryDays).unix(),
      )
    }
    if (isPlaceBid) {
      onCancel()
    }
  }
  const handleInputAmount = (v: any) => {
    setBidAmount(v.target.value || 0)
  }

  return (
    <TokenPlaceBidContainer>
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
          Place a bid
        </Typography>
        <Typography
          variant="h1"
          style={{
            fontSize: 16,
            cursor: 'pointer',
          }}
          onClick={onCancel}
        >
          {!isPlaceBid ? 'Cancel' : 'Done'}
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
          {activeStep === 0 && 'Bid amount'}
          {steps[activeStep] === 'Convert' && 'Convert'}
          {steps[activeStep] === 'Approve' && 'Approve'}
          {steps[activeStep] === 'Sign' && !isPlaceBid && !isBidLoading && 'Sign'}
          {steps[activeStep] === 'Sign' && !isPlaceBid && isBidLoading && 'Bid in progress'}
          {steps[activeStep] === 'Sign' && isPlaceBid && 'Your bid is placed'}
        </Typography>
        <Typography
          variant="h1"
          style={{
            fontSize: 16,
            marginTop: '32px',
          }}
        >
          {activeStep === 0 && `Your bid for this NFT`}
          {(steps[activeStep] === 'Convert' || steps[activeStep] === 'Approve') && `Perform this with your wallet`}
          {steps[activeStep] === 'Sign' && !isPlaceBid && !isBidLoading && 'Set your bid expiry time'}
          {steps[activeStep] === 'Sign' && !isPlaceBid && isBidLoading && 'Please wait while we confirm your bid'}
          {steps[activeStep] === 'Sign' &&
            isPlaceBid &&
            `Please keep your ${bidAmount} WCORE available in your wallet for the bid to be valid.`}
        </Typography>
        <Box
          style={{
            marginTop: '24px',
          }}
        >
          {activeStep === 0 && (
            <StyledSearch>
              <StyledInputBase type="number" placeholder="0.0" onChange={handleInputAmount} />
              <SearchIconWrapper>WCORE</SearchIconWrapper>
            </StyledSearch>
          )}
        </Box>
        {activeStep === 0 && (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
            }}
          >
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              Your CORE balance
            </Typography>
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              {new BigNumber(coreBalance).dp(2, 1).toString(10)} CORE
            </Typography>
          </Box>
        )}
        {activeStep === 0 && (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
            }}
          >
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              Your WCORE balance
            </Typography>
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              {new BigNumber(wcoreBalance).dp(2, 1).toString(10)} WCORE
            </Typography>
          </Box>
        )}
        {steps[activeStep] === 'Convert' && (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
            }}
          >
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              From
            </Typography>
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              {new BigNumber(bidAmount).minus(wcoreBalance).toString(10)} CORE
            </Typography>
          </Box>
        )}
        {steps[activeStep] === 'Convert' && (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
            }}
          >
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              To
            </Typography>
            <Typography
              style={{
                fontSize: 14,
              }}
            >
              {new BigNumber(bidAmount).minus(wcoreBalance).toString(10)} WCORE
            </Typography>
          </Box>
        )}
        {steps[activeStep] === 'Sign' && !isPlaceBid && !isBidLoading && (
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
                className="expiry-item"
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
        {steps[activeStep] === 'Sign' && !isPlaceBid && !isBidLoading && (
          <Typography
            style={{
              fontSize: 14,
              marginTop: 24,
            }}
          >
            Your bid will expire on {moment().add('days', expiryDays).format('LLL')}
          </Typography>
        )}
        <Box
          style={{
            marginTop: '24px',
          }}
        >
          {new BigNumber(bidAmount).isGreaterThan(wcoreBalance) &&
            (steps[activeStep] === 'Bid amount' || steps[activeStep] === 'Convert') && (
              <Typography
                style={{
                  fontSize: 14,
                  padding: '24px 0',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                {new BigNumber(bidAmount).minus(wcoreBalance).toString(10)} CORE will be converted to{' '}
                {new BigNumber(bidAmount).minus(wcoreBalance).toString(10)} WCORE
              </Typography>
            )}
          {steps[activeStep] === 'Sign' && !isPlaceBid && !isBidLoading && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              You&apos;re placing a bid for {bidAmount} WCORE
            </Typography>
          )}
          {steps[activeStep] === 'Sign' && !isPlaceBid && isBidLoading && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              Your bid on the NFT is being placed
            </Typography>
          )}
          {steps[activeStep] === 'Sign' && isPlaceBid && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              Your bid will expire on {moment().add('days', expiryDays).format('LLL')}
            </Typography>
          )}
          <Button
            sx={{ width: '100%', py: '12px', backgroundColor: '#3960C1' }}
            variant="contained"
            color="secondary"
            disableElevation
            disabled={
              activeStep === 0 &&
              (new BigNumber(bidAmount || 0).isLessThanOrEqualTo(0) ||
                new BigNumber(bidAmount || 0).isGreaterThanOrEqualTo(new BigNumber(coreBalance).plus(wcoreBalance)))
            }
            onClick={handleStep}
          >
            {activeStep === 0 && 'Next step'}
            {steps[activeStep] === 'Convert' && (
              <>
                {isConvertLoading && (
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
                {isConvertLoading ? 'Pending conversion' : 'Convert'}
              </>
            )}
            {steps[activeStep] === 'Approve' && (
              <>
                {isApproveLoading && (
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
                {isApproveLoading ? 'Pending approval' : 'Approve'}
              </>
            )}
            {steps[activeStep] === 'Sign' && !isPlaceBid && (
              <>
                {isBidLoading && (
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
                {isBidLoading ? 'Pending confirmation' : 'Place bid'}
              </>
            )}
            {steps[activeStep] === 'Sign' && isPlaceBid && 'DONE'}
          </Button>
        </Box>
      </Box>
    </TokenPlaceBidContainer>
  )
}

export default TokenPlaceBid
