import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon } from 'archerswap-uikit'

const DropDownHeader = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  border: 1px solid #3960c1;
  box-sizing: border-box;
  border-radius: 8px;
  transition: border-radius 0.15s;
  & h4 {
    user-select: none;
    padding-left: 13px;
    padding-right: 43px;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text};
  }
`
const ChainIcon = styled.img`
  height: 20px;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  width: 100%;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
    @media (max-width: 767px) {
      min-width: 60px;
    }
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  border-radius: 8px;
  height: 52px;
  min-width: 136px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid 1px solid #3960c1;
        box-sizing: border-box;
        border-radius: 8px 8px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid #3960c1;
        box-sizing: border-box;
        border-top-width: 0;
        border-radius: 0 0 8px 8px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 8px 16px;
  & h4 {
    user-select: none;
    padding-left: 18px;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text};
  }
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface OptionProps {
  label: string
  value: string
  chainId: string
  image: string
}

export interface SelectProps {
  options: OptionProps[]
  selectedValue: OptionProps
  onChange: (option: OptionProps) => void
}

const Select: React.FunctionComponent<SelectProps> = ({ options, selectedValue, onChange }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (option: OptionProps) => () => {
    onChange(option)
    setIsOpen(false)
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })
  }, [])

  return (
    <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling}>
          <ChainIcon src={selectedValue.image} alt="from" />
          <h4>{selectedValue.label}</h4>
        </DropDownHeader>
      )}
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option) =>
            option.label !== selectedValue.label ? (
              <ListItem onClick={onOptionClicked(option)} key={option.label}>
                <ChainIcon src={option.image} alt="from" />
                <h4>{option.label}</h4>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
