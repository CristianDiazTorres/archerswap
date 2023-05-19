/* eslint-disable no-nested-ternary */
import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Banner from 'components/Banner'
import CollectionCard from 'components/Marketplace/CollectionCard'
import { useCollections } from 'hooks/api'

const Background = styled.div<any>`
  width: 100%;
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.card};

  .my-nft-btn-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 85px;

    @media (max-width: 768px) {
      padding: 0 24px;
    }
  }
`

const CollectionList = styled.div`
  width: 100%;
  display: grid;
  column-gap: 24px;
  row-gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(312px, 312px));
  justify-content: center;
  padding: 40px 85px;
  background: ${({ theme }) => theme.colors.card};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 240px));
    justify-content: center;
    padding: 24px;
  }
`

const Marketplace: React.FC = () => {
  const { isDark } = useTheme()
  const collections = useCollections()

  return (
    <Background isDark={isDark}>
      <Banner
        src="/images/assets/banners/marketplace_banner.png"
        mobileSrc="/images/assets/banners/mobile_marketplace_banner.png"
        alt="marketplace_banner"
        title="NFT MARKET"
        text="Buy and Sell NFTs on CORE Network"
      />
      <CollectionList>
        {collections.map((collection) => (
          <CollectionCard collectionInfo={collection} key={collection.name} />
        ))}
      </CollectionList>
    </Background>
  )
}

export default Marketplace
