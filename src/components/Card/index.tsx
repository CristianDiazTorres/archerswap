import styled from 'styled-components'

const Card = styled.div<any>`
  width: 100%;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
`
export default Card

export const LightCard = styled(Card)<{isDark: boolean}>`
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  background-color: ${({ theme }) => theme.colors.background};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.tertiary};
`
