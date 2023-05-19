import React, { useState } from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'state/types'
import { useMatchBreakpoints } from 'archerswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { useNFTData, useNftStakingData } from 'hooks/useKyudoNFT'

import TotalApr from './TotalApr'
import Apr from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import BoostPanel from './BoostPanel'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

export interface RowProps {
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
  farmApr: number
  feeApr: number
  apr: any
}

const cells = {
  farmApr: Apr,
  feeApr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`

const Row: React.FunctionComponent<RowProps> = (props) => {
  const { details, farm } = props
  const [actionPanelToggled, setActionPanelToggled] = useState(false)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelToggled(!actionPanelToggled)
  }

  const { isXl, isXs } = useMatchBreakpoints()

  const isMobile = !isXl
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  const { isApproved } = useNFTData()
  const { nftTokenIds, boosts } = useNftStakingData()

  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }

            switch (key) {
              case 'details':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelToggled} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Total Earned APR')}>
                        <TotalApr apr={props.apr.apr} farmApr={props.apr.farmApr} feeApr={props.apr.feeApr} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'farmApr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Farm APR')}>
                        <Apr apr={props.farmApr} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'feeApr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('LP Fee APR')}>
                        <Apr apr={props.feeApr} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t(tableSchema[columnIndex].label)}>
                        {React.createElement(cells[key], props[key])}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
            }
          })}
        </StyledTr>
      )
    }

    return (
      <StyledTr onClick={toggleActionPanel}>
        <td>
          <tr>
            <FarmMobileCell>
              <CellLayout>
                <Farm {...props.farm} />
              </CellLayout>
            </FarmMobileCell>
          </tr>
          <tr style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <EarnedMobileCell>
              <CellLayout label={t('Earned')}>
                <Earned {...props.earned} />
              </CellLayout>
            </EarnedMobileCell>
            <AprMobileCell>
              <CellLayout label={t('Farm APR')}>
                <Apr apr={props?.apr?.farmApr} />
              </CellLayout>
            </AprMobileCell>
            <AprMobileCell>
              <CellLayout label={t('LP Fee APR')}>
                <Apr apr={props?.apr?.feeApr} />
              </CellLayout>
            </AprMobileCell>
          </tr>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelToggled} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {actionPanelToggled && details && (
        <tr>
          <td colSpan={6}>
            <ActionPanel {...props} />
            <BoostPanel
              pid={farm.pid}
              tokenIds={nftTokenIds[farm.pid]}
              boost={boosts[farm.pid]}
              isApproved={isApproved}
            />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
