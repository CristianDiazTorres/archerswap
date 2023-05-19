import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import Box from '@mui/material/Box'
import ActiveBidsTable from 'components/Marketplace/Table/ActiveBidsTable/ActiveBidsTable'

const columns: any = [
  { id: 'wcore', label: 'WCORE', minWidth: 170 },
  { id: 'usd', label: 'USD', minWidth: 170 },
  { id: 'from', label: 'From', minWidth: 100 },
  { id: 'expiration', label: 'Expiration', minWidth: 100 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'right',
  },
]

const getDiffDate = (timestamp) => {
  const diffDays = moment(timestamp * 1000).diff(moment(new Date()), 'days')
  if (diffDays) return `${Math.abs(diffDays)} days`
  const diffHours = moment(timestamp * 1000).diff(moment(new Date()), 'hours')
  if (diffHours) return `${Math.abs(diffHours)} hours`
  const diffMinutes = moment(timestamp * 1000).diff(moment(new Date()), 'minutes')
  if (diffMinutes) return `${Math.abs(diffMinutes)} minutes`
  const diffSeconds = moment(timestamp * 1000).diff(moment(new Date()), 'seconds')
  return `${Math.abs(diffSeconds || 0)} seconds`
}

const Offers = ({ tokenBids, priceData, account, tokenOwner, onCancelBid, onAcceptBid }: any) => {
  const [rows, setRows] = useState([])
  useEffect(() => {
    const _rows: any = []
    ;(tokenBids || []).map((e: any) => {
      const rowData = {
        tokenId: e.tokenId,
        wcore: new BigNumber(e.value).div(10 ** 18).toString(),
        rawWcore: e.value,
        usd: `~$${new BigNumber(e.value)
          .div(10 ** 18)
          .times(priceData || 0)
          .dp(2, 1)
          .toString()}`,
        from: account === e.bidder ? 'You' : `${e.bidder.substr(0, 4)}...${e.bidder.substr(e.bidder.length - 4, 4)}`,
        fromFullAddress: e.bidder,
        expiration: `${getDiffDate(e.expireTimestamp)}`,
        action: '',
      }
      if (account === e.bidder) {
        rowData.action = 'Cancel'
      } else if (account === tokenOwner) {
        rowData.action = 'Accept'
      }
      _rows.push(rowData)
      return true
    })
    setRows(_rows)
  }, [account, tokenOwner, tokenBids, priceData])
  return (
    <>
      <Box
        style={{
          borderRadius: '20px',
          boxShadow: '0px 4px 10px rgba(105, 105, 105, 0.15)',
        }}
      >
        <ActiveBidsTable
          tableTitle="Active Bids"
          columns={columns}
          rows={rows}
          onCancelBid={onCancelBid}
          onAcceptBid={onAcceptBid}
        />
      </Box>
    </>
  )
}

export default Offers
