import React from 'react'
import styled from 'styled-components'
import { Text, Button } from 'archerswap-uikit'

const StyledBanner = styled.img`
  height: 100%;
  display: none;
  position: relative;
  min-width: 154px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`
const StyledMobileBanner = styled.img`
  position: relative;
  min-width: 154px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  .welcome-text {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    line-height: 99%;
    color: #000000;
    font-size: 30px;

    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 30px;
    }

    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 60px;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 74px;
    }
  }
  .trade-text {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    color: #000000;
    font-size: 18px;
    padding-top: 5px;
      
    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 20px;
      padding-top: 5px;
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 28px;
      padding-top: 11px;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 32px;
      padding-top: 21.81px;
    }
  }
  .bow-text {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    color: #000000;
    font-size: 14px;
    padding-top: 6px;
  
    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 12px;
      padding-top: 6px;
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 20px;
      padding-top: 9px;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 24px;
      padding-top: 10px;
    }
  }
  .button-lg {
    display: none;
    ${({ theme }) => theme.mediaQueries.xs} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.xl} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      display: none;
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      display: block;
    }
  }
  .button-sm {
    display: none;
    ${({ theme }) => theme.mediaQueries.xs} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.xl} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      display: none;
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      display: block;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      display: none;
    }
  }
  .button-xs {
    display: block;
    ${({ theme }) => theme.mediaQueries.xs} {
      display: block;
    }

    ${({ theme }) => theme.mediaQueries.xl} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      display: block;
    }
  
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  
    ${({ theme }) => theme.mediaQueries.lg} {
      display: none;
    }
  }
`

const ImageContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: end;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 9px;
  padding-top: 22px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 22px;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    padding-top: 22px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 22px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 30px;
  }
`

const BannerContainer = styled.div<{ isDark: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  background: ${(props) =>
    props.theme.isDark ? "linear-gradient(86.46deg,#6C3A00 0%,#F78E15 101.73%)": null};
  padding-top: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
   padding-top: 20px;
  }
  
  ${({ theme }) => theme.mediaQueries.xs} {
    padding-top: 15px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 0px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 0px;
  }
`

const StyledContent = styled.div<{ left: string }>`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 45px;
  padding-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    margin-left: 45px;
    padding-bottom: 20px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 30px;
    padding-bottom: 0px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-left: 0px;
    padding-bottom: 0px;
  }
`

const BannerArcher = ({ src, alt, head, head2, title, text, mobileSrc, isDark, white = false, left = '' }) => {
  return (
    <BannerContainer isDark={isDark}>
      <StyledContent left={left}>
        <WelcomeContainer>
          <Text className="welcome-text">{head}<br/>{head2}</Text>
          <Text className="trade-text">{title}</Text>
          <Text className="bow-text">{text}</Text>
          <ButtonContainer>
            <Button variant="tradeprimary" scale="md" mr="8px" className="button-lg">
              Trade
            </Button>
            <Button variant="tradesecondary" scale="md" mr="8px" className="button-lg">
              Farms
            </Button>
            <Button variant="tradeprimary" scale="sm" mr="8px" className="button-sm">
              Trade
            </Button>
            <Button variant="tradesecondary" scale="sm" mr="8px" className="button-sm">
              Farms
            </Button>
            <Button variant="tradeprimary" scale="sm" mr="8px" className="button-xs">
              Trade
            </Button>
            <Button variant="tradesecondary" scale="sm" mr="8px" className="button-xs">
              Farms
            </Button>
          </ButtonContainer>
        </WelcomeContainer>
      </StyledContent>
      <ImageContainer>
        <StyledMobileBanner src={mobileSrc} alt={alt} />
        <StyledBanner src={src} alt={alt} />
      </ImageContainer>
    </BannerContainer>
  )
}

export default BannerArcher
