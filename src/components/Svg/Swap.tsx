import React from 'react'

import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  0% {
    transform: matrix(1.00,0.00,0.00,1.00,0,0);
  }

  1%{
    transform: matrix(0.8,0.00,0.00,1.00,0,0);
  }

  2% {
    transform:matrix(1.1,0.00,0.00,1.00,0,0);
  }

  3% {
    transform: matrix(0.90,0.00,0.00,1.00,0,0);
  }

  4%{
    transform: matrix(1.00,0.00,0.00,1.00,0,0);
  }
`

const StyledPath = styled.path`
  width: 100%;
  animation: ${rotate} 10s linear infinite;
`

function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="none" viewBox="0 0 46 46">
      <circle cx="23" cy="23" r="23" fill="#E7F9F7" transform="rotate(-90 23 23)" />
      <StyledPath
        stroke="#3960C1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 22.59h15.908M27.5 19.182l3.408 3.409L27.5 26"
      />
    </svg>
  )
}

export default Icon
