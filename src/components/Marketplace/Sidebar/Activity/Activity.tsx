import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// import moment from 'moment'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import { Button } from 'archerswap-uikit'
import ActivityTable from '../../Table/ActivityTable/ActivityTable'
import ListingButton from '../../ListingButton/ListingButton'

// import getDiffDate from '../../../utils/helpers/getDiffDate'
// import useERC721TotalRecentEvents from '../../../utils/hooks/useERC721TotalRecentEvents'
// import { EVENTS } from '../../../config/constant'

const DrawerContainer = styled.div`
  .circle-btn {
    width: 40px;
    height: 40px;
    background: #e7f9f7;
    border-radius: 50%;
    padding: 6px;
    margin-right: 24px;
  }
`

type Anchor = 'top' | 'left' | 'bottom' | 'right'

const columns: any = [
  { id: 'event', label: 'Event', minWidth: 170 },
  {
    id: 'name',
    label: 'Name',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'item',
    label: 'Item',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'price',
    label: 'CORE',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'from',
    label: 'From',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'to',
    label: 'To',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'right',
  },
]

export default function TemporaryDrawer() {
  const [rows, setRows] = useState([])
  const [events, setEvents] = useState([
    'TokenBought',
    'TokenBidAccepted',
    'TokenListed',
    'Transfer',
    'TokenBidEntered',
  ])

  // const activityAllData: any = useERC721TotalRecentEvents({
  //   chainId: 56,
  //   events,
  // })

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  useEffect(() => {
    const _rows: any = []
    const activityAllData = []
    ;(activityAllData || []).map((e: any) => {
      _rows.push({
        event: 'Sale', // EVENTS[e.event],
        name: e.collection?.name,
        item: { ...e.token, id: e.tokenId },
        price: e.valueNum,
        from: e.from.substr(2, 6),
        to: e.to ? e.to.substr(2, 6) : '-',
        date: '2 days ago', // `${getDiffDate(moment(e.timestamp).unix() * 1000)} ago`,
        transactionHash: e.transactionHash,
      })
      return _rows
    })
    setRows(_rows)
  }, [])

  const handleActivityListing = (type: any) => {
    if (type === 'All') {
      setEvents(['TokenBought', 'TokenBidAccepted', 'TokenListed', 'Transfer', 'TokenBidEntered'])
    } else if (type === 'Listing') {
      setEvents(['TokenListed'])
    } else if (type === 'Offers') {
      setEvents(['TokenBidEntered'])
    } else if (type === 'Sold') {
      setEvents(['TokenBought', 'TokenBidAccepted'])
    }
  }

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    handleActivityListing('All')
    setState({ ...state, [anchor]: open })
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: {
          xs: '100%',
          md: anchor === 'top' || anchor === 'bottom' ? 'auto' : 'auto',
        },
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '28px', fontWeight: '600', color: '#FFFFFF' }}>Activity</Typography>
        </Box>
        <Box onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)} sx={{ cursor: 'pointer' }}>
          <img src="/images/nfts/marketplace/close.svg" alt="close" />
        </Box>
      </Box>
      <Box sx={{}}>
        <ListingButton onActivityListing={handleActivityListing} />
        <Typography
          sx={{
            fontSize: { xs: '20px', md: '24px' },
            fontWeight: '600',
            padding: '24px 32px',
            color: '#0A0A0A',
          }}
        >
          Last Events
        </Typography>
      </Box>
      <ActivityTable columns={columns} rows={rows} events={events} />
    </Box>
  )

  return (
    <DrawerContainer>
      <Button className="circle-btn" onClick={toggleDrawer('right', true)}>
        <img src="/images/nfts/marketplace/analytic.svg" alt="analytic" />
      </Button>
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
