import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 50%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
    ${({ theme }) => theme.mediaQueries.xl} {
      max-width: 30%;
      min-width: 180px;
    }
  }
`

export default FlexLayout
