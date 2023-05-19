import React from 'react'
import styled from 'styled-components'
import { Button } from 'archerswap-uikit'
import { Link } from 'react-router-dom'

const AnalyticHeadContainer = styled.div`
  display: flex;
  align-items: center;

  // a {
  //   margin-right: 24px;
  // }
`
const AnalyticHead = () => {
  return (
    <AnalyticHeadContainer>
      <Link to="/my-nfts">
        <Button>My NFTs</Button>
      </Link>
      {/* <ActivityBar />
      <SearchBar /> */}
    </AnalyticHeadContainer>
  )
}

export default AnalyticHead
