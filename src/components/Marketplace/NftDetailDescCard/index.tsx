import React from 'react'
import { Button } from 'archerswap-uikit'
import styled from 'styled-components'

const NftDetailDescCardContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(105, 105, 105, 0.15);
  border-radius: 20px;

  .title {
    font-weight: 600;
    font-size: 20px;
    color: #1d2131;
    padding: 24px 32px;
    border-bottom: 1px solid #ecedf0;
  }
  .description {
    font-weight: 400;
    font-size: 14px;
    color: #394162;
    padding: 24px 32px;
  }

  .btn-wrap {
    display: flex;
    align-items: center;
    padding: 0 32px 24px 32px;

    .link-item {
      display: flex;
      align-items: center;

      button {
        width: 40px;
        height: 40px;
        background: #3960c1;
        border-radius: 50%;
        padding: 6px;
      }
      .name {
        margin-left: 18px;
        font-weight: 400;
        font-size: 16px;
        color: #4d4d4d;
      }
    }

    .link-item:first-child {
      margin-right: 48px;
    }
  }
`
const NftDetailDescCard = () => {
  return (
    <NftDetailDescCardContainer>
      <div className="title">Description</div>
      <div className="description">
        8,888 Editions of drop #1 Maalavidaa from #888InnerCircle X The Drops Genesis series. Holders of this NFT are
        able to create their very own InnerCircle PFP.
      </div>
      <div className="btn-wrap">
        <div className="link-item">
          <Button>
            <img src="/images/nfts/marketplace/scan.svg" alt="analytic" />
          </Button>
          <div className="name">Contract</div>
        </div>
        <div className="link-item">
          <Button>
            <img src="/images/nfts/marketplace/global.svg" alt="analytic" />
          </Button>
          <div className="name">Website</div>
        </div>
      </div>
    </NftDetailDescCardContainer>
  )
}

export default NftDetailDescCard
