import React from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

const InfoWrap = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);

  span,
  a,
  p {
    color: ${({ theme }) => theme.colors.text};
  }
`

const Info = ({ collectionInfo }: any) => {
  return (
    <InfoWrap>
      <Box sx={{}}>
        <Typography sx={{ py: '16px', px: '24px' }}>Info</Typography>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            gap: '25px',
            py: '20px',
            px: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: { xs: '10px', md: '20px' },
              boxShadow: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <a href={collectionInfo?.websiteUrl} rel="noreferrer" target="_blank">
                <IconButton
                  aria-label="search"
                  sx={{
                    padding: '0',
                    boxShadow: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#3960C1',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: '#3960C1',
                    },
                  }}
                >
                  <img src="/images/nfts/marketplace/global.svg" alt="global" />
                </IconButton>
              </a>
              <Typography>Website</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <IconButton
                aria-label="search"
                sx={{
                  padding: '0',
                  boxShadow: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#3960C1',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: '#3960C1',
                  },
                }}
              >
                <a
                  href={`https://scan.coredao.org/address/${collectionInfo?.address}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src="/images/nfts/marketplace/scan.svg" alt="scan" />
                </a>
              </IconButton>
              <Typography>Contract</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </InfoWrap>
  )
}

export default Info
