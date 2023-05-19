import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
  //min-height: calc(100vh - 64px);
  padding-top: 0px;
  padding-bottom: 16px;
  max-width: 1220px;
  margin-top: -10px;
  
  ${({ theme }) => theme.mediaQueries.xs} {
    padding-top: 10px;
    padding-bottom: 24px;
    margin-top: -20px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 12px;
    padding-bottom: 32px;
    margin-top: -30px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 12px;
    padding-bottom: 32px;
    margin-top: -40px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 12px;
    padding-bottom: 32px;
    margin-top: -50px;
  }
`

export default Page
