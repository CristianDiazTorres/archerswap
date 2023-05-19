import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Skeleton, Text, Flex } from 'archerswap-uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { useGetStats, useTokensData } from 'hooks/api'
import { useFarms, useGetApiPrices, usePools, useOneDayVolume } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { usePairsLength } from 'hooks/useTokenBalance'
import useBowInfo from 'hooks/useBowInfo'

const StyledTotalValueLockedCard = styled(Card)<any>`
  background: ${({ theme, isDark }) => (isDark ? theme.card.background : '#fff')};
  box-shadow: ${({ theme, isDark }) =>
    isDark ? '0px 3.5px 10px rgba(134, 145, 172, 0.1)' : '0px 3.5px 10px rgba(10, 14, 22, 0.1)'};
  border-radius: 0px;
  border: ${({ theme, isDark }) => (isDark ? '1px solid #29292D' : '0px solid')};
`
const Block = styled.div`
  .BlockTradingHeader {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    
  }
  .BlockTradingContent {
    font-family: 'Doppio One';
    font-style: normal;
    font-weight: 400;
  }
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const data = useGetStats()
  const farms = useFarms()
  const prices = useGetApiPrices()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const { isDark } = useTheme()
  const oneDayVolume = useOneDayVolume()
  const pairsLength = usePairsLength()
  const tokenslength = useTokensData()
  const { totalLockedBow } = useBowInfo()

  const tvl = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const farmTVL = farms.reduce((accum, farm) => {
      if (!farm.lpTotalInQuoteToken || !prices) {
        return accum
      }

      const quoteTokenPriceUsd = prices[farm.quoteToken.symbol.toLowerCase()]
      const liquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
      return accum.plus(liquidity)
    }, new BigNumber(0))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const poolTVL = pools.reduce((accum, pool) => {
      if (!pool) {
        return accum
      }

      const stakingTokenPriceUsd = prices[pool.stakingToken.symbol.toLowerCase()]
      const liquidity = new BigNumber(pool.totalStaked)
        .div(new BigNumber(10).pow(pool.stakingToken.decimals))
        .times(stakingTokenPriceUsd)
      return accum.plus(liquidity)
    }, new BigNumber(0))

    const pairTVL = new BigNumber(data ? data.total_value_locked_all : 0)

    const xbowTVL = totalLockedBow.times(prices.bow)

    // const totalTVL = farmTVL.plus(poolTVL).plus(pairTVL).plus(xbowTVL)
    const totalTVL = pairTVL.plus(xbowTVL)

    return totalTVL.toNumber().toLocaleString('en-US', { maximumFractionDigits: 0 })
  }, [data, farms, pools, prices, totalLockedBow])

  return (
    <StyledTotalValueLockedCard isDark={isDark}>
      <CardBody>
        <Flex justifyContent="space-between">
          <Block>
            <Text fontSize="16px" color="#BA6401" className="BlockTradingHeader">
              {t('24h Trading Volume')}
              <br />
            </Text>
            {data ? (
              <>
                <Text fontSize="22px" fontWeight={600} color="#A9A29D" className="BlockTradingContent">
                  ${oneDayVolume.oneDayVolumeUSD.toLocaleString('en-US', { maximumFractionDigits: 3 })}
                </Text>
              </>
            ) : (
              <>
                <Skeleton height={50} />
              </>
            )}
          </Block>

          <Block>
            <Text fontSize="16px" color="#BA6401" textAlign="right" className="BlockTradingHeader">
              {t('Coins')}
            </Text>

            <Text fontSize="22px" fontWeight={600} color="#A9A29D" textAlign="right" className="BlockTradingContent">
              {tokenslength}
            </Text>
          </Block>
        </Flex>

        <Flex justifyContent="space-between">
          <Block>
            <Text fontSize="16px" color="#BA6401" className="BlockTradingHeader">
              {t('Total Valued Locked (TVL)')}
              <br />
            </Text>
            {data ? (
              <>
                <Text fontSize="22px" fontWeight={600} color="#A9A29D" className="BlockTradingContent">{`$${tvl}`}</Text>
              </>
            ) : (
              <>
                <Skeleton height={50} />
              </>
            )}
          </Block>

          <Block>
            <Text fontSize="16px" color="#BA6401" textAlign="right" className="BlockTradingHeader">
              {t('Pairs')}
            </Text>
            <Text fontSize="22px" fontWeight={600} color="#A9A29D" textAlign="right" className="BlockTradingContent">
              {pairsLength}
            </Text>
          </Block>
        </Flex>
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
