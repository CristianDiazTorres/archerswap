import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'archerswap-uikit'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardMedia from '@mui/material/CardMedia'
import Search from 'components/Marketplace/Search/Search'

// import useCollections from '../../../utils/hooks/useCollections'

const DrawerContainer = styled.div`
  .circle-btn {
    width: 40px;
    height: 40px;
    background: #e7f9f7;
    border-radius: 50%;
    padding: 6px;
  }
`

type Anchor = 'top' | 'left' | 'bottom' | 'right'

export default function TemporaryDrawer() {
  const [searchText, setSearchText] = useState('')
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  // const collections = useCollections()
  const collections = []

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setSearchText('')
    setState({ ...state, [anchor]: open })
  }

  const handleSearch = (v: any) => {
    setSearchText(v.target.value)
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: {
          xs: '100%',
          md: anchor === 'top' || anchor === 'bottom' ? 'auto' : 600,
        },

        gap: '16px',
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#3960C1',
          padding: '15px 32px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Typography sx={{ fontSize: '28px', fontWeight: '600', color: '#FFFFFF' }}>Search</Typography>
        </Box>
        <Box onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)} sx={{ cursor: 'pointer' }}>
          <img src="/images/nfts/marketplace/close.svg" alt="close" />
        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: '24px' }}>
        <Search type="text" placeholder="Search Collection Name…" onChange={handleSearch} />
      </Box>
      <Box
        sx={{
          width: '85%',
          mx: 'auto',
        }}
      >
        {collections
          .filter((collection: any) => collection.name.toLowerCase().includes(searchText.toLowerCase()))
          .map((collection: any) => (
            <Link to={`/collections/${collection.alias}`}>
              <Button key={collection.name} onClick={toggleDrawer(anchor, false)}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '60%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="40"
                      image={collection.thumbnailUrl}
                      alt=""
                      sx={{ maxWidth: '40px', borderRadius: '50px' }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <Typography width="100%" sx={{ fontWeight: 600 }}>
                        {collection.name}
                      </Typography>
                      <Typography width="100%" sx={{ fontSize: '12px' }}>
                        {collection.last24HVolume || 0} CORE 24h volume
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Typography
                      sx={{
                        p: '5px 25px',
                        bgcolor: 'rgba(246, 246, 246, 1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {collection.totalSupply} items
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Link>
          ))}
      </Box>
    </Box>
  )

  return (
    <DrawerContainer>
      <IconButton
        aria-label="search"
        sx={{
          padding: '0',
          boxShadow: 'none',
          maxWidth: { xs: '40px', md: '50px' },
        }}
        onClick={toggleDrawer('right', true)}
      >
        <Button className="circle-btn">
          <img src="/images/nfts/marketplace/search.svg" alt="analytic" />
        </Button>
      </IconButton>
      <Drawer
        transitionDuration={{ enter: 400, exit: 400 }}
        anchor="right"
        open={state.right}
        onClose={toggleDrawer('right', false)}
        PaperProps={{ sx: { width: { xs: '100%', md: 'auto' } } }}
      >
        {list('right')}
      </Drawer>
    </DrawerContainer>
  )
}
