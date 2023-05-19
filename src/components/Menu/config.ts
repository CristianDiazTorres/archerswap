import { MenuEntry } from 'archerswap-uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    items: [
      {
        label: t('Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity'),
        href: '/pool',
      },
      // {
      //   label: 'Zap',
      //   href: 'https://archerswap.finance/#/zap',
      // },
    ],
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Staking'),
    icon: 'PoolIcon',
    href: '/xbow',
  },
  {
    label: t('Bridge'),
    icon: 'BridgeIcon',
    href: '/bridge',
  },
  {
    label: t('NFT'),
    icon: 'NftIcon',
    href: '/nft',
    tag:'Coming Soon',
  },
  {
    label: 'Token Sales',
    icon: 'IfoIcon',
    href: '/iho',
  },  
  {
    label: t('Info'),
    icon: 'InfoIcon',
    href: 'https://info.archerswap.finance/home',
    target: '_blank',
    items: [
      {
        label: "Overview",
        href: "https://info.archerswap.com/home",
        target: "_blank",
      },
      {
        label: "Tokens",
        href: "https://info.archerswap.com/tokens",
        target: "_blank",
      },
      {
        label: "Pairs",
        href: "https://info.archerswap.com/pairs",
        target: "_blank",
      },
      {
        label: "Accounts",
        href: "https://info.archerswap.com/accounts",
        target: "_blank",
      },
    ],
  },
  {
    label: t('Lottery'),
    icon: 'TicketIcon',
    href: '/lottery',
  },
  {
    label: 'Referrals',
    icon: 'ReferralIcon',
    href: '/referral',
  },
  {
    label: t('Multisender'),
    icon: 'DisperseIcon',
    href: '/disperse',
  },
  {
    label: t('Partnership'),
    icon: 'PartnerIcon',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSffYIbIQYYjr52AeRolVPcNNTF6vIjS3qTUACa9UpbIlFVp7w/viewform',
    target: '_blank',
  },
  {
    label: t('Audit'),
    icon: 'AuditIcon',
    href: 'https://docs.archerswap.finance/products-and-features-guide/audit',
    target: '_blank',
  },
  // {
  //   label: 'Listing',
  //   icon: 'ReferralIcon',
  //   items: [
  //     {
  //       label: 'Snowtrace Explorer',
  //       href: 'https://scan.coredao.org/token/0x695Fa794d59106cEbd40ab5f5cA19F458c723829',
  //       target: '_blank',
  //     },
  //     {
  //       label: 'DappRadar',
  //       href: '#',
  //     },
  //     {
  //       label: 'CoinGecko',
  //       href: '#',
  //     },
  //     {
  //       label: 'CoinMarketCap',
  //       href: '#',
  //     },
  //   ],
  // },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Docs'),
        href: 'https://docs.archerswap.finance',
        target: '_blank',
      },
      {
        label: t('Medium'),
        href: 'https://medium.com/@archerswap',
        target: '_blank',
      },
      {
        label: t('Dexscreener'),
        href: 'https://dexscreener.com/core/0xbb8502132c87ee31be0e2bc1cb8cc69374488261',
        target: '_blank',
      },
      {
        label: t('Gecko Terminal'),
        href: 'https://geckoterminal.com/core/archerswap/pools',
        target: '_blank',
      },
      // {
      //   label: t('Vote'),
      //   href: 'https://vote.archerswap.finance/',
      //   target: '_blank',
      // },
    ],
  },
]

export default config
