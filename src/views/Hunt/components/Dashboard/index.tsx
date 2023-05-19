import React from 'react'
import styled from 'styled-components'
import BuyHunt from './BuyHunt'
import SatsCard from './SatsCard'

function Dashboard() {
  return (
    <StyledContainer>
      <SatsCard />
      <BuyHunt />
    </StyledContainer>
  )
}

export default Dashboard

const StyledContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`
