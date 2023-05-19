import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from 'archerswap-uikit'
import { CommunityTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityVault?: boolean
  vaultImage?: string
  tokenSymbol?: string
  provider?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.card};
  background-color: ${({ theme }) => theme.colors.text};
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityVault,
  vaultImage,
  tokenSymbol,
  provider,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Image src={`/images/farms/${vaultImage.toLocaleLowerCase()}.svg`} alt={tokenSymbol} width={64} height={64} />
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCommunityVault ? <CommunityTag /> : <CoreTag provider={provider} />}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
