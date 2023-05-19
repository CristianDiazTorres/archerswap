import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'

import Option from './Option/Option'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

const TraitButtonWrap = styled.div`
  border: 1px solid ${(props) => props.theme.colors.textDisabled};
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
`

const TraitListWrap = styled(Box)`
  span,
  p,
  div {
    color: ${({ theme }) => theme.colors.text};
  }

  .bottom-btn-wrap {
    background: ${({ theme }) => theme.colors.background};
  }
`

export default function TemporaryDrawer({ collectionInfo, attributeInfo, traitFilter, onChangeTraits }: any) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const [options, setOptions] = useState([])

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

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const list = (anchor: Anchor) => (
    <TraitListWrap
      sx={{
        width: {
          xs: '100%',
          md: anchor === 'top' || anchor === 'bottom' ? 'auto' : 600,
        },

        gap: '16px',
        position: 'relative',
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          my: '18px',
          mx: '32px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Box sx={{ maxWidth: '40px', display: 'flex', alignItems: 'center' }}>
            <img src="/images/nfts/marketplace/traits.svg" alt="traits" />
          </Box>
          <Typography sx={{ fontSize: '28px', fontWeight: '600', color: '#3960C1' }}>Traits</Typography>
        </Box>
        <Box onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)} sx={{ cursor: 'pointer' }}>
          <img src="/images/nfts/marketplace/close.svg" alt="close" />
        </Box>
      </Box>
      <Divider sx={{ mb: '24px' }} />
      <Box
        sx={{
          width: '90%',
          mx: 'auto',
        }}
      >
        <Option options={options} traitFilter={traitFilter} onChangeTraits={onChangeTraits} />
      </Box>
      <Box
        className="bottom-btn-wrap"
        sx={{
          position: 'sticky',
          bottom: 0,
          py: '15px',
        }}
      >
        <Box
          sx={{
            width: '80%',
            mx: 'auto',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disableElevation
            sx={{
              borderRadius: '12px',
              paddingY: { xs: '8px', md: '12.5px' },
              paddingX: '24px',
              boxShadow: 'none',
              width: '100%',
              background: '#2a4aa6',
            }}
            onClick={() => {
              onChangeTraits([])
            }}
          >
            Clear all filters
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            sx={{
              borderRadius: '12px',
              paddingY: { xs: '8px', md: '12.5px' },
              paddingX: '24px',
              boxShadow: 'none',
              width: '100%',
              background: '#2a4aa6',
            }}
            onClick={toggleDrawer(anchor, false)}
          >
            Done
          </Button>
        </Box>
      </Box>
    </TraitListWrap>
  )

  return (
    <TraitButtonWrap>
      {['Traits'].map((text, index) => (
        <ListItem
          onClick={toggleDrawer('right', true)}
          button
          key={text}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 24px',
            fontWeight: 500,
            fontSize: 14,
            borderRadius: 24,
            cursor: 'pointer',
          }}
        >
          <img src="/images/nfts/marketplace/traits.svg" alt="traits" />
          <ListItemText primary={text} />
        </ListItem>
      ))}
      <Drawer
        transitionDuration={{ enter: 400, exit: 400 }}
        anchor="right"
        open={state.right}
        onClose={toggleDrawer('right', false)}
        PaperProps={{ sx: { width: { xs: '100%', md: 'auto' } } }}
      >
        {list('right')}
      </Drawer>
    </TraitButtonWrap>
  )
}
