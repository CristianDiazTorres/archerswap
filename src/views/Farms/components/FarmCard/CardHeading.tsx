import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading } from 'archerswap-uikit'
import { CommunityTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
  color: #199e46;
  background-color: #e8fdf0;
`

const IconImage = styled.div`
  display: flex;
  margin-right: 5px;
  .first {
    position: relative;
    display: block;
    border-radius: 50%;
    z-index: 2;
    width: 30px;
    height: 30px;

    ${({ theme }) => theme.mediaQueries.sm} {
      width: 40px;
      height: 40px;
    }
  }
  .last {
    z-index: 3;
    display: block;
    margin-left: -10px;
    border-radius: 50%;
    width: 30px;
    height: 30px;

    ${({ theme }) => theme.mediaQueries.sm} {
      width: 40px;
      height: 40px;
      margin-left: -20px;
    }
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  farmImage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenSymbol,
}) => {
  return (
    <Wrapper px={24} justifyContent="space-between" alignItems="center" mb="12px">
      <IconImage>
        <img className="first" src={`/images/tokens/${farmImage.split('-')[0].toLocaleLowerCase()}.png`} alt="icon" />
        <img className="last" src={`/images/tokens/${farmImage.split('-')[1].toLocaleLowerCase()}.png`} alt="icon" />
      </IconImage>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
