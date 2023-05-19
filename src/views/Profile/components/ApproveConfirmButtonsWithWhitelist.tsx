import React from 'react'
import styled from 'styled-components'
import {
  ChevronRightIcon,
  Text,
  Button as UIKitButton,
  AutoRenewIcon,
  ChevronDownIcon,
  Box,
  Flex,
} from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'

interface ApproveConfirmButtonsProps {
  privateSale: boolean
  isWhitelisted: boolean
  isApproveDisabled: boolean
  isApproving: boolean
  isConfirming: boolean
  isConfirmDisabled: boolean
  onApprove: () => void
  onConfirm: () => void
}

const StyledApprovConfirmButtons = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 24px 1fr;
  }
`

const Button = styled(UIKitButton)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 160px;
  }
`

const iconAttrs = { width: '24px', color: 'textDisabled' }

const ChevronRight = styled(ChevronRightIcon).attrs(iconAttrs)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const ChevronBottom = styled(ChevronDownIcon).attrs(iconAttrs)`
  display: block;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

const ApproveConfirmButtonsWithWhitelist: React.FC<ApproveConfirmButtonsProps> = ({
  privateSale,
  isWhitelisted,
  isApproveDisabled,
  isApproving,
  isConfirming,
  isConfirmDisabled,
  onApprove,
  onConfirm,
}) => {
  const { t } = useTranslation()
  if (privateSale && !isWhitelisted) {
    return (
      <Text as="p" mb="24px" style={{ textAlign: 'center', width: '100%' }}>
        You are not whitlisted.
      </Text>
    )
  }
  return (
    <StyledApprovConfirmButtons>
      <Box>
        <Button
          disabled={isApproveDisabled}
          onClick={onApprove}
          endIcon={isApproving ? spinnerIcon : undefined}
          isLoading={isApproving}
        >
          {isApproving ? t('Approving') : t('Approve')}
        </Button>
      </Box>
      <Flex justifyContent="center">
        <ChevronRight />
        <ChevronBottom />
      </Flex>
      <Box>
        <Button
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          isLoading={isConfirming}
          endIcon={isConfirming ? spinnerIcon : undefined}
        >
          {isConfirming ? t('Confirming') : t('Confirm')}
        </Button>
      </Box>
    </StyledApprovConfirmButtons>
  )
}

export default ApproveConfirmButtonsWithWhitelist
