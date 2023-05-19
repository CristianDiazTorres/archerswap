import React from 'react'
import { StyledSearch, SearchIconWrapper, StyledInputBase } from './styles'

const Search = ({ type = 'number', placeholder = 'Search Mint number…', onChange }: any) => {
  return (
    <>
      <StyledSearch sx={{ bgcolor: '#F5F5F5', color: '#999999', borderRadius: '24px' }}>
        <SearchIconWrapper>
          <img src="/images/nfts/marketplace/search.svg" alt="analytic" />
        </SearchIconWrapper>
        <StyledInputBase
          type={type}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search' }}
          onChange={onChange}
        />
      </StyledSearch>
    </>
  )
}

export default Search
