import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Traits from 'components/Marketplace/Sidebar/Traits/Traits'

const SortButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.card};
  padding: 24px 85px;

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
  }

  .sort-wrap {
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      flex-wrap: wrap;
    }

    .sort-by {
      font-weight: 400;
      font-size: 12px;
      color: ${({ theme }) => theme.colors.text};
      margin-right: 16px;

      @media (max-width: 768px) {
        display: none;
      }
    }

    .sort-item {
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${({ theme }) => theme.colors.card};
      border: 1px solid ${(props) => props.theme.colors.textDisabled};
      border-radius: 24px;
      font-weight: 500;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.text};
      cursor: pointer;
      padding: 6px 24px;
      margin: 4px 8px;
    }

    .active-sort {
      color: #3960c1;
    }
  }

  .traits-btn {
    @media (max-width: 768px) {
      margin-top: 24px;
    }
    img {
      margin-right: 12px;
    }
  }
`
const SortButtons = ({ tabType, collectionInfo, attributeInfo, traitFilter, onSort, onChangeTraits }) => {
  const [sorts, setSorts] = useState<any>([
    { label: 'Token ID - Lowest', value: 'lowest' },
    { label: 'Token ID - Highest', value: 'highest' },
    { label: 'Rarity - Rare', value: 'rare' },
    { label: 'Rarity - Common', value: 'common' },
  ])
  const [sortType, setSortType] = useState('')

  useEffect(() => {
    if (tabType === 'All') {
      setSorts([
        { label: 'Token ID - Lowest', value: 'lowest' },
        { label: 'Token ID - Highest', value: 'highest' },
        { label: 'Rarity - Rare', value: 'rare' },
        { label: 'Rarity - Common', value: 'common' },
      ])
    } else if (tabType === 'Listing' || tabType === 'Offers') {
      setSorts([
        { label: 'Price - Lowest', value: 'price_lowest' },
        { label: 'Price - Highest', value: 'price_highest' },
        { label: 'Rarity - Rare', value: 'rare' },
        { label: 'Rarity - Common', value: 'common' },
      ])
    } else if (tabType === 'Sold') {
      setSorts([
        { label: 'Sold - Latest', value: 'sold_latest' },
        { label: 'Price - Lowest', value: 'price_lowest' },
        { label: 'Price - Highest', value: 'price_highest' },
        { label: 'Rarity - Rare', value: 'rare' },
        { label: 'Rarity - Common', value: 'common' },
      ])
    }
    setSortType('')
  }, [tabType])

  return (
    <SortButtonsContainer>
      <div className="sort-wrap">
        <div className="sort-by">SORT BY</div>
        {sorts.map((sort: any, index: any) => (
          <div
            key={sort.value}
            className={`sort-item ${sortType === sort.value ? 'active-sort' : ''}`}
            onClick={() => {
              onSort(sort.value)
              setSortType(sort.value)
            }}
            role="presentation"
          >
            {sort.label}
          </div>
        ))}
      </div>
      <div className="traits-btn">
        <Traits
          collectionInfo={collectionInfo}
          attributeInfo={attributeInfo}
          traitFilter={traitFilter}
          onChangeTraits={onChangeTraits}
        />
      </div>
    </SortButtonsContainer>
  )
}

export default SortButtons
