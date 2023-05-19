import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

const StyledTag = styled(Tag)`
  font-weight: 500;
`

const CoreTag = (props) => {
  const { t } = useTranslation()
  return (
    <StyledTag variant="text" outline startIcon={<VerifiedIcon />} {...props}>
      {t('Core')}
    </StyledTag>
  )
}

const CommunityTag = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="text" outline startIcon={<CommunityIcon />} {...props}>
      {t('Community')}
    </Tag>
  )
}

const DualTag = (props) => (
  <Tag variant="text" outline {...props}>
    Dual
  </Tag>
)

export { CoreTag, CommunityTag, DualTag }
