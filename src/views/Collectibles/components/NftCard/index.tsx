import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  useModal,
} from 'archerswap-uikit'
import { useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Nft } from 'config/constants/types'
import InfoRow from '../InfoRow'
import TransferNftModal from '../TransferNftModal'
import ClaimNftModal from '../ClaimNftModal'
import Preview from './Preview'

interface NftCardProps {
  nft: Nft
  canClaim?: boolean
  tokenIds?: number[]
  onSuccess: () => void
}

const Header = styled(InfoRow)`
  min-height: 28px;
`

const DetailsButton = styled(Button).attrs({ variant: 'text' })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  padding: 24px;
`

const NftCard: React.FC<NftCardProps> = ({ nft, onSuccess, canClaim = false, tokenIds = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const { profile } = useProfile()
  const { bunnyId, name, description } = nft
  const walletOwnsNft = tokenIds.length > 0
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  const handleClick = async () => {
    setIsOpen(!isOpen)
  }

  const [onPresentTransferModal] = useModal(<TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={onSuccess} />)
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={onSuccess} />)

  return (
    <Card isActive={walletOwnsNft || canClaim}>
      <Preview nft={nft} isOwned={walletOwnsNft} />
      <CardBody>
        <Header>
          <Heading>{name}</Heading>
          {walletOwnsNft && (
            <Tag outline variant="secondary">
              {t('In Wallet')}
            </Tag>
          )}
          {profile?.nft?.bunnyId === bunnyId && (
            <Tag outline variant="success">
              {t('Profile Pic')}
            </Tag>
          )}
        </Header>
        {canClaim && (
          <Button width="100%" mt="24px" onClick={onPresentClaimModal}>
            {t('Claim this NFT')}
          </Button>
        )}
        {walletOwnsNft && (
          <Button width="100%" variant="secondary" mt="24px" onClick={onPresentTransferModal}>
            {t('Transfer')}
          </Button>
        )}
      </CardBody>
      <CardFooter p="0">
        <DetailsButton width="100%" endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
          {t('Details')}
        </DetailsButton>
        {isOpen && (
          <InfoBlock>
            <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
              {description}
            </Text>
          </InfoBlock>
        )}
      </CardFooter>
    </Card>
  )
}

export default NftCard
