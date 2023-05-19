import React from 'react'
import { Text, TextProps } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { TranslatableText as AchievementTitleType } from 'state/types'

interface AchievementTitleProps extends TextProps {
  title: AchievementTitleType
}

const AchievementTitle: React.FC<AchievementTitleProps> = ({ title, ...props }) => {
  const { t } = useTranslation()

  if (typeof title === 'string') {
    return (
      <Text bold {...props}>
        {title}
      </Text>
    )
  }

  const { fallback, data = {} } = title

  return (
    <Text bold {...props}>
      {t(fallback, data)}
    </Text>
  )
}

export default AchievementTitle
