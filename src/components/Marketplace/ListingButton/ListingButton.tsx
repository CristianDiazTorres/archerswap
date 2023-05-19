import React, { useState } from 'react'

import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const ListingButton = ({ onActivityListing }: any) => {
  const [button, setButton] = useState(0)
  const buttons = [
    {
      title: 'All',
    },
    {
      title: 'Listing',
    },
    {
      title: 'Offers',
    },
    {
      title: 'Sold',
    },
  ]
  return (
    <>
      <Box
        display="flex"
        pb="15px"
        justifyContent="center"
        sx={{
          width: '909px',
          flexWrap: {
            xs: 'wrap',
            md: 'nowrap',
          },
          paddingBottom: 0,
        }}
      >
        {buttons.map((e, index) => {
          return (
            <Typography
              key={e.title}
              color="primary"
              sx={{
                width: '120px',
                fontSize: { xs: '16px', md: '20px' },
                color: index === button ? '#0E1019' : '#B0B3C0',
                borderBottom: index === button ? '4px solid #3960C1' : '',
                cursor: 'pointer',
                padding: '16px',
                textAlign: 'center',
              }}
              fontWeight="700"
              onClick={() => {
                setButton(index)
                onActivityListing(e.title)
              }}
            >
              {e.title}
            </Typography>
          )
        })}
      </Box>
      <Divider />
    </>
  )
}

export default ListingButton
