import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'

const Select = ({ select, isChecked, onChange }: any) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: '10px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Checkbox checked={isChecked} onClick={onChange} />
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 400,
              color: 'rgba(51, 51, 51, 1)',
            }}
          >
            {select.label || 'None'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(51, 51, 51, 1)',
            }}
          >
            {select.amount}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              color: 'rgba(133, 133, 133, 1)',
            }}
          >
            {select.percentage}%
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default Select
