import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'archerswap-uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    .nft-loader {
      color: ${({ theme }) => theme.colors.text};
    }

    .MuiButton-root.Mui-disabled {
      color: ${({ theme }) => theme.colors.text};
    }

    .MuiPaper-root {
      background-color: ${({ theme }) => theme.colors.card};
      box-shadow: none;
      .MuiTableContainer-root {
        p {
          color: ${({ theme }) => theme.colors.text};
        }
        thead {
          th {
            background-color: ${({ theme }) => theme.colors.card};
            color: ${({ theme }) => theme.colors.text};
          }
        }
        tbody {
          td {
            color: ${({ theme }) => theme.colors.text};
          }
        }
      }

      .MuiTablePagination-root {
        color: ${({ theme }) => theme.colors.text};
        button {
          ${({ theme }) => theme.colors.text};
        }
        svg {
          fill: ${({ theme }) => theme.colors.text};
        }
      }

      li {
        color: ${({ theme }) => theme.colors.text};
      }
    }

    .MuiButtonGroup-root {
      background-color: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.text};
    }

    img {
      height: auto;
      max-width: 100%;
    }
  }

  .ReactCollapse--collapse {
    transition: height 500ms;
  }
`

export default GlobalStyle
