import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box'
import Table from 'components/Marketplace/Table/Table'

const columns: any = [
  { id: 'event', label: 'Event', minWidth: 170 },
  { id: 'core', label: 'CORE', minWidth: 170 },
  { id: 'from', label: 'From', minWidth: 100 },
  { id: 'to', label: 'To', minWidth: 100 },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'right',
  },
]

const EVENTS: any = {
  TokenBidWithdrawn: 'Canceled',
  TokenBought: 'Sale',
  TokenBidAccepted: 'Sale',
  TokenDelisted: 'DeListing',
  TokenListed: 'Listing',
  TokenBidEntered: 'Bid',
  Transfer: 'Transfer',
}

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

const History = ({ tokenEvents }: any) => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const _rows: any = []
    ;(tokenEvents || []).map((e: any) => {
      _rows.push({
        event: EVENTS[e.event],
        core: e.valueNum,
        from: e.from.substr(2, 6),
        to: e.to ? e.to.substr(2, 6) : '-',
        date: `${getDiffDate(e.timestamp)} ago`,
        transactionHash: e.transactionHash,
      })
      return true
    })
    setRows(_rows)
  }, [tokenEvents])
  return (
    <>
      <Box
        style={{
          borderRadius: '20px',
          boxShadow: '0px 4px 10px rgba(105, 105, 105, 0.15)',
        }}
      >
        <Table tableTitle="Transaction History" columns={columns} rows={rows} />
      </Box>
    </>
  )
}

export default History
