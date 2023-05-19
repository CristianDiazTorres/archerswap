import React from 'react'
import styled from 'styled-components'
import { Heading, Text, Flex } from 'archerswap-uikit'

interface IfoCardHeaderProps {
  ifoId: string
  name: string
  subTitle: string
}

const StyledIfoCardHeader = styled(Flex)`
  & > div {
    flex: 1;
  }
`

const Name = styled(Heading).attrs({ as: 'h3', size: 'lg' })`
  margin-bottom: 4px;
  text-align: left;
  margin-left: 20px;
`

const Description = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  text-align: left;
  margin-left: 20px;
`

const IfoCardHeader: React.FC<IfoCardHeaderProps> = ({ ifoId, name, subTitle }) => {
  return (
    <StyledIfoCardHeader mb="30px" alignItems="center">
      <img
        src={`/images/ifos/${ifoId}.png`}
        alt={ifoId}
        width="50px"
        height="50px"
        style={{ maxWidth: '50px', maxHeight: '50px' }}
      />
      <div>
        <Name>{name}</Name>
        <Description>{subTitle}</Description>
      </div>
    </StyledIfoCardHeader>
  )
}

export default IfoCardHeader
