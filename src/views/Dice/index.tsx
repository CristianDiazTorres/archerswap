import React from 'react'
import styled from 'styled-components'
import { Card, Text, Button } from 'archerswap-uikit'
import Container from 'components/layout/Container'
import { useTranslation } from 'contexts/Localization'
import Hero from './Hero'

const Background = styled.div`
  width: 100%;
  height: 1000px;
  background-image: url('/images/assets/bg11.svg');
  background-repeat: no-repeat;
  background-position: top right;
`

const StyledContainer = styled(Container)`
  max-width: 1034px;
`

const StyledCard = styled(Card)`
  padding: 53px 61px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
  max-width: 996px;
  width: 100%;
  border-radius: 20px;
  box-shadow: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 32px;

  @media (max-width: 768px) {
    padding: 20px 21px;
    grid-template-columns: 1fr;
  }
`

const ImageDiv = styled.div`
  min-height: 350px;
  background-image: url('/images/assets/dice-bg.svg');
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const ImageDiv1 = styled.div`
  height: 190px;
  background-image: url('/images/assets/dice-bg.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 300px 190px;
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 23px;
`

const BtnWrapper = styled.div`
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
`

const Dice = () => {
  const { t } = useTranslation()

  return (
    <Background>
      <Hero />
      <StyledContainer>
        <StyledCard>
          <ImageDiv1>
            <img src="/images/assets/dice-bar.svg" alt="dice" style={{ width: '80%' }} />
          </ImageDiv1>
          <div>
            <Text fontSize="18px" bold style={{ marginBottom: '26px', textTransform: 'capitalize' }}>
              {t('How it works')}
            </Text>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                01
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t('Players can use BNB to play dice.')}
              </Text>
            </Item>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                02
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t('After depositing BNB, create a new game or join an already created game.')}
              </Text>
            </Item>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                03
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t('When the game starts: type dice, select a :dice Emoji, and send it to the bot.')}
              </Text>
            </Item>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                04
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t('It should be a dice emoji, not a string.')}
              </Text>
            </Item>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                05
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t('After each player has rolled the dice, you can check the scores of all players.')}
              </Text>
            </Item>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                06
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t(
                  'Finally, the winner receives 90% of the total game amount. (5% Treasury, 5% BOW buyback and burn).',
                )}
              </Text>
            </Item>
            <Item>
              <Text fontSize="18px" style={{ marginRight: '22px' }}>
                07
              </Text>
              <Text fontSize="18px" style={{ flex: '1' }}>
                {t('There is a 1% fee for all withdrawals.')}
              </Text>
            </Item>
            <BtnWrapper>
              <Button
                as="a"
                // onClick={}
                style={{ width: '266px', marginTop: '17px' }}
              >
                {t('Join Game')}
              </Button>
            </BtnWrapper>
          </div>
          <ImageDiv>
            <img src="/images/assets/dice-bar.svg" alt="dice" />
          </ImageDiv>
        </StyledCard>
      </StyledContainer>
    </Background>
  )
}

export default Dice
