import React from 'react'
import styled, { keyframes } from 'styled-components'

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`

const StyledBackground = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    background-image: url('/images/assets/farmingbg.svg');
    background-repeat: no-repeat;
    background-position: center 110px;
  }
`

const Img = styled.img`
  animation: ${float} 4s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`

const JetFarming = () => {
  return (
    <StyledBackground>
      <Img src="/images/assets/farming.svg" alt="jet" />
    </StyledBackground>
  )
}

export default JetFarming
