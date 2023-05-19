import React from 'react'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'

const TokenImage = ({ imageUrl }: any) => {
  return (
    <>
      <Box width="100%" sx={{ pt: '100%', position: 'relative' }}>
        <CardMedia
          component="img"
          height="auto"
          image={imageUrl}
          alt=""
          sx={{
            borderRadius: '12px',
            bottom: 0,
            left: 0,
            margin: 'auto',
            height: '100%',
            maxWidth: '100%',
            right: 0,
            position: 'absolute',
            top: 0,
          }}
        />
      </Box>
    </>
  )
}

export default TokenImage
