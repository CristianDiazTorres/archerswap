export type TableProps = {
  data?: TableDataTypes[]
  selectedFilters?: string
  sortBy?: string
  sortDir?: string
  onSort?: (value: string) => void
}

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  translationId: number
  sortable: boolean
}

export type ScrollBarProps = {
  ref: string
  width: number
}

export type TableDataTypes = {
  POOL: string
  APY: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    translationId: 999,
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'earned',
    translationId: 1072,
    sortable: true,
    label: 'Earned',
  },
  {
    id: 3,
    name: 'apr',
    translationId: 736,
    sortable: true,
    label: 'APR',
  },
  // {
  //   id: 3,
  //   name: 'farmApr',
  //   translationId: 736,
  //   sortable: true,
  //   label: 'Farm APR',
  // },
  // {
  //   id: 4,
  //   name: 'feeApr',
  //   translationId: 736,
  //   sortable: true,
  //   label: 'LP Fee APR',
  // },
  {
    id: 7,
    name: 'details',
    translationId: 999,
    sortable: true,
    label: '',
  },
]

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    translationId: 999,
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'earned',
    translationId: 1072,
    sortable: true,
    label: 'Earned',
  },
  {
    id: 3,
    name: 'apr',
    translationId: 736,
    sortable: true,
    label: 'APR',
  },
  // {
  //   id: 3,
  //   name: 'farmApr',
  //   translationId: 736,
  //   sortable: true,
  //   label: 'Farm APR',
  // },
  // {
  //   id: 4,
  //   name: 'feeApr',
  //   translationId: 736,
  //   sortable: true,
  //   label: 'LP Fee APR',
  // },
  {
    id: 5,
    name: 'liquidity',
    translationId: 999,
    sortable: true,
    label: 'Liquidity',
  },
  {
    id: 6,
    name: 'multiplier',
    translationId: 999,
    sortable: true,
    label: 'Multiplier',
  },
  {
    id: 7,
    name: 'details',
    translationId: 999,
    sortable: true,
    label: '',
  },
]

export enum ViewMode {
  'TABLE' = 'TABLE',
  'CARD' = 'CARD',
}
