import React from 'react'
import styled from 'styled-components'

const CollectionInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 42px 85px;
  background: ${({ theme }) => theme.colors.card};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px;
  }
`

const InfoWrap = styled.div`
  .name {
    font-size: 32px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.bow};
    margin-bottom: 16px;
  }

  .description {
    display: flex;
    align-items: center;

    img {
      margin-right: 16px;
    }

    .rarity-desc {
      font-size: 14px;
      font-weight: 400;
      color: ${({ theme }) => theme.colors.text};
      span {
        font-weight: bold;
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }

  .link-wrap {
    margin-top: 32px;
    img {
      width: 40px;
      height: 40px;
      background: ${({ theme }) => theme.colors.primary};
      padding: 11px;
      border-radius: 50%;
      cursor: pointer;
    }
    a {
      margin-right: 28px;
    }
  }
`

const InfoDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 24px;
  }

  .summary-wrap {
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.card};
    border: 0.5px solid #d7d9e0;
    box-sizing: border-box;
    border-radius: 16px;
    padding: 20px 16px;
    margin-bottom: 28px;

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 29px;

      .label {
        font-size: 12px;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 4px;
      }
      .value {
        font-size: 16px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }

  .search-input-wrap {
    max-width: 276px;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.card};
    border: 1px solid #d7d9e0;
    box-sizing: border-box;
    border-radius: 24px;
    padding: 8px 16px;

    input {
      width: 100%;
      font-weight: 400;
      font-size: 14px;
      background: ${({ theme }) => theme.colors.card};
      color: ${({ theme }) => theme.colors.text};
      border: none;
      outline: none;
      margin-left: 16px;
    }
  }
`

const CollectionInfo = ({ collectionInfo, floor, onSearch }) => {
  return (
    <CollectionInfoContainer>
      <InfoWrap>
        <div className="name">{collectionInfo?.name || ''}</div>
        <div className="description">
          <img src="/images/nfts/marketplace/wifi.svg" alt="mint" />
          <div className="rarity-desc">
            <span>Mint</span> - Rarity rank will change as minting&apos;s live
          </div>
        </div>
        <div className="link-wrap">
          {/* <img src="/images/nfts/marketplace/analytic_white.svg" alt="analytic" /> */}
          <a href={`https://scan.coredao.org/address/${collectionInfo?.address}`} rel="noreferrer" target="_blank">
            <img src="/images/nfts/marketplace/scan.svg" alt="scan" />
          </a>
          <a href={collectionInfo.websiteUrl} rel="noreferrer" target="_blank">
            <img src="/images/nfts/marketplace/global.svg" alt="global" />
          </a>
        </div>
      </InfoWrap>
      <InfoDetail>
        <div className="summary-wrap">
          <div className="summary-item">
            <div className="label">Items</div>
            <div className="value">{collectionInfo?.totalSupply || 0}</div>
          </div>
          <div className="summary-item">
            <div className="label">Volume traded</div>
            <div className="value">{collectionInfo?.totalVolume || 0}</div>
          </div>
          <div className="summary-item">
            <div className="label">Floor price</div>
            <div className="value">{floor} CORE</div>
          </div>
        </div>
        <div className="search-input-wrap">
          <img src="/images/nfts/marketplace/search.svg" alt="search" />
          <input placeholder="Mint number" type="number" onChange={onSearch} />
        </div>
      </InfoDetail>
    </CollectionInfoContainer>
  )
}

export default CollectionInfo
