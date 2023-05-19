import React, { useState } from 'react'
// import styled from 'styled-components'
import { Text, CardFooter, Button, ChevronDownIcon, ChevronUpIcon } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { Ifo } from 'config/constants/types'
import { PublicIfoState } from '../../hooks/useGetPublicIfoData'

export interface IfoCardDetailsProps {
  ifo: Ifo
  publicIfoData: PublicIfoState
}

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({ ifo }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const { description } = ifo
  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <CardFooter>
      <Button
        variant="text"
        onClick={handleToggle}
        width="100%"
        endIcon={
          isOpen ? <ChevronUpIcon color="primary" width="24px" /> : <ChevronDownIcon color="primary" width="24px" />
        }
      >
        {isOpen ? t('Hide') : t('Details')}
      </Button>
      {isOpen && (
        <>
          <Text as="p" color="textSubtle" mb="30px" mt="5px">
            {t(description)}
          </Text>
        </>
      )}
    </CardFooter>
  )
}

export default IfoCardDetails
