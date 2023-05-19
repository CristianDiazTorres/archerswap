import React, { useState } from 'react'
import styled from 'styled-components'

const CategoryTabContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-top: 1px solid #f0f0f0;
  background: ${({ theme }) => theme.colors.card};

  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 100%;
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;

    @media (max-width: 768px) {
      width: 60px;
      font-size: 14px;
    }

    &:not(:last-child) {
      margin-right: 40px;
      @media (max-width: 768px) {
        margin-right: 12px;
      }
    }
  }

  .active-tab {
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 4px solid #3960c1;
  }
`
const CategoryTab = ({ onActivityListing }: any) => {
  const [button, setButton] = useState(0)
  const buttons = [
    {
      title: 'All',
    },
    {
      title: 'Listing',
    },
    {
      title: 'Offers',
    },
    {
      title: 'Sold',
    },
  ]

  return (
    <CategoryTabContainer>
      {buttons.map((e, index) => {
        return (
          <div
            key={e.title}
            className={`tab-item ${index === button ? 'active-tab' : ''}`}
            onClick={() => {
              setButton(index)
              onActivityListing(e.title)
            }}
            role="presentation"
          >
            {e.title}
          </div>
        )
      })}
    </CategoryTabContainer>
  )
}

export default CategoryTab
