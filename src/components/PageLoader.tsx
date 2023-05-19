import React from 'react'
import styled from 'styled-components'
import { Spinner } from 'archerswap-uikit'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spinner img="/logo.png" size={75} />
    </Wrapper>
  )
}

export default PageLoader
