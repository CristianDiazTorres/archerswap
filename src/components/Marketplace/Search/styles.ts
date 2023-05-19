import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'

export const StyledSearch = styled('div')(() => ({
  position: 'relative',
  width: '100%',
}))

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '8px',
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}))
