import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
// import { ButtonMenu, ButtonMenuItem } from 'archerswap-uikit'
import useI18n from 'hooks/useI18n'

const StyledNav = styled.div`
  margin-bottom: 40px;
`
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
`
const TabItem = styled(Link)<{ active: boolean }>`
  display: flex;
  padding: 11px 57px;
  background: ${(props) => (props.active ? '#EAAA08' : props.theme.colors.tertiary)};
  border-radius: 32px;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => (props.active ? '#ffffff' : props.theme.colors.textSubtle)};
  z-index: ${(props) => (props.active ? '1' : '0')};
  margin: 32px -18px;
  cursor: pointer;
  
  &:hover {
    color: ${(props) => (props.active ? '#ffffff' : props.theme.colors.textSubtle)};
  }
`

const Bridge = styled.a<{ active: boolean }>`
  display: flex;
  padding: 11px 57px;
  background: ${(props) => (props.active ? '#EAAA08' : props.theme.colors.tertiary)};
  border-radius: 32px;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => (props.active ? '#ffffff' : props.theme.colors.textSubtle)};
  z-index: ${(props) => (props.active ? '1' : '0')};
  margin: 32px -18px;
  cursor: pointer;
  
  &:hover {
    color: ${(props) => (props.active ? '#ffffff' : props.theme.colors.textSubtle)};
  }
`

function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
   /* eslint-disable @typescript-eslint/no-unused-vars */
  const [activeTab, setActiveTab] = React.useState(activeIndex)
  const TranslateString = useI18n()
  return (
    <StyledNav>
      <TabContainer>
        <TabItem active={activeTab === 0} id="swap-nav-link" to="/swap" style={{ borderRadius: '30px' }}>
          {TranslateString(1142, 'Swap')}
        </TabItem>
        <TabItem active={activeTab === 1} id="pool-nav-link" to="/pool" style={{ borderRadius: '30px' }}>
          {TranslateString(262, 'Liquidity')}
        </TabItem>
        <Bridge active={activeTab === 2} id="bridge-nav-link" href="https://bridge.coredao.org/bridge" style={{ borderRadius: '30px' }} target="_blank">
            {TranslateString(92, 'Bridge')}
        </Bridge>
        {/* <ButtonMenuItem id="zapin-nav-link" to="/zap" as={Link} style={{ borderRadius: '30px' }}>
          {TranslateString(92, 'Zap')}
        </ButtonMenuItem> */}
      </TabContainer>
    </StyledNav>
  )
}

export default Nav


