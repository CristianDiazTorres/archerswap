import React from 'react'
import styled from 'styled-components'
import { Button } from 'archerswap-uikit'
import { Link } from 'react-router-dom'

const CollectionCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
  border-radius: 16px;

  .collection_wrap {
    height: 160px;
    overflow: hidden;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  .name {
    font-weight: 600;
    font-size: 20px;
    color: ${({ theme }) => theme.colors.text};
    margin-top: 18px;
    margin-bottom: 18px;
  }

  button {
    width: 148px;
    height: 28px;
    background-color: transparent;
    box-sizing: border-box;
    border-radius: 24px;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 12px;
  }
`
const CollectionCard = ({ collectionInfo = {} }: any) => {
  return (
    <CollectionCardContainer>
      <div className="collection_wrap">
        <img className="collection_banner" src={collectionInfo.bannerUrl} alt="collection" />
      </div>
      <div className="name">{collectionInfo.name || ''}</div>
      <Link to={`/marketplace/${collectionInfo.alias}`}>
        <Button>Marketplace</Button>
      </Link>
    </CollectionCardContainer>
  )
}

export default CollectionCard
