import { ReactText } from 'react'

export interface Language {
  code: string
  language: string
  locale: string
}

export type ContextData = {
  [key: string]: ReactText
}

export interface ProviderState {
  isFetching: boolean
  currentLanguage: Language
}

export interface ContextApi extends ProviderState {
  setLanguage: (language: Language) => void
  t: (key: string, data?: ContextData) => string
}
