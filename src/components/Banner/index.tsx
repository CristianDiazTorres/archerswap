import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'archerswap-uikit'

const StyledBanner = styled.img`
  width: 100%;
  height: 100%;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`
const StyledMobileBanner = styled.img`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`
const BannerContainer = styled.div`
  position: relative;
`
const StyledText = styled(Text)`
  max-width: 350px;
`
const StyledContent = styled.div<{ left: string }>`
  z-index: 10;
  height: 45%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  top: 0;
  left: 7%;
  bottom: 0;
  ${({ theme }) => theme.mediaQueries.md} {
    height: 85%;
    left: ${({ left }) => (left === 'no_icon' ? '10%' : '15%')};
  }
`

const Banner = ({ src, alt, title, text, mobileSrc, white = false, left = '' }) => {
  return (
    <BannerContainer>
      <StyledMobileBanner src={mobileSrc} alt={alt} />
      <StyledBanner src={src} alt={alt} />
      <StyledContent left={left}>
        <div>
          <Heading as="h1" size="xl" color={white ? '#FFFFFF' : '#1C1917'} mb="10px">
            {title}
          </Heading>
          <StyledText color={white ? '#FFFFFF' : '#57534E'} fontSize="16px" fontWeight={600}>
            {text}
          </StyledText>
        </div>
      </StyledContent>
    </BannerContainer>
  )
}

export default Banner
