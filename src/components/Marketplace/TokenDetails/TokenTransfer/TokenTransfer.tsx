import React, { useState, useEffect } from 'react'
import Web3 from 'web3'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTransferToken } from 'hooks/useNftMarketplace'
import { StyledSearch, SearchIconWrapper, StyledInputBase } from './styles'

const steps = ['Enter CORE address', 'Success']
const TokenTransfer = ({ account, collectionInfo, tokenInfo, onCancel }: any) => {
  const [activeStep, setActiveStep] = useState(0)
  const [destAddress, setDestAddress] = useState('')

  const [isTransferLoading, isTransferred, transferToken] = useTransferToken(collectionInfo?.address)

  useEffect(() => {
    if (isTransferred) {
      setActiveStep(1)
    }
  }, [isTransferred])

  const handleStep = () => {
    if (activeStep === 0) {
      transferToken(account, destAddress, tokenInfo?.tokenId)
    } else {
      onCancel()
    }
  }
  const handleInputAddress = (v: any) => {
    setDestAddress(v.target.value || 0)
  }

  return (
    <Box>
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
          Transfer ownership
        </Typography>
        <Typography
          variant="h1"
          style={{
            fontSize: 16,
            cursor: 'pointer',
          }}
          onClick={onCancel}
        >
          {isTransferred ? 'Done' : 'Cancel'}
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
          {activeStep === 0 && 'Enter CORE address'}
          {activeStep === 1 && 'Successfully transfered!'}
        </Typography>
        <Typography
          variant="h1"
          style={{
            fontSize: 16,
            marginTop: '32px',
          }}
        >
          {activeStep === 0 && `Transfer ${tokenInfo?.name || ''}`}
        </Typography>
        <Box
          style={{
            marginTop: '24px',
          }}
        >
          {activeStep === 0 && (
            <StyledSearch>
              <StyledInputBase type="text" placeholder="Enter a valid address" onChange={handleInputAddress} />
              <SearchIconWrapper>
                <Box sx={{ maxWidth: '20px' }}>CORE</Box>
              </SearchIconWrapper>
            </StyledSearch>
          )}
        </Box>
        <Box
          style={{
            marginTop: '24px',
          }}
        >
          {activeStep === 0 && Web3.utils.isAddress(destAddress) && (
            <Typography
              style={{
                fontSize: 14,
                padding: '24px 0',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              Please confirm this address is correct{' '}
              <strong>{`${destAddress.substr(0, 4)}...${destAddress.substr(destAddress.length - 4, 4)}`}</strong>
            </Typography>
          )}
          <Button
            sx={{ width: '100%', py: '12px', backgroundColor: '#3960C1' }}
            variant="contained"
            color="secondary"
            disableElevation
            disabled={activeStep === 0 && !Web3.utils.isAddress(destAddress)}
            onClick={handleStep}
          >
            {isTransferLoading && (
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
            {activeStep === 0 && 'Transfer'}
            {activeStep === 1 && 'Done'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TokenTransfer
