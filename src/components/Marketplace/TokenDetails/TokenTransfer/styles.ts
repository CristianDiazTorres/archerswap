import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'

export const StyledSearch = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  width: '100%',
}))

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  right: 40,
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
    padding: theme.spacing(2.5, 2.1, 2.3, 2.5),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(6)})`,
    width: '100%',
  },
}))
