import React from 'react'
import Countdown from 'react-countdown'
import Typography from '@mui/material/Typography'

export default function CountTimeDown({ timestamp, onExpired }: any) {
  const renderer = ({ days, hours, minutes, completed }: any) => {
    if (completed) {
      onExpired()
      return <></>
      // Render a completed state
    }
    // Render a countdown
    return (
      <Typography sx={{ fontSize: '12px', color: '#666666' }}>
        {days ? `${days} days : ` : ''}
        {hours ? `${hours} hours : ` : ''}
        {minutes ? `${minutes} minutes` : ''}
      </Typography>
    )
  }
  if (!timestamp) {
    return null
  }
  return <Countdown date={timestamp * 1000} renderer={renderer} />
}
