import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import Select from '../Select/Select'

const Option = ({ options, traitFilter, onChangeTraits }: any) => {
  const [traits, setTraits] = useState<any>(traitFilter)
  const [indexes, setIndexes] = useState<any>([])

  useEffect(() => {
    setTraits(traitFilter)
  }, [traitFilter])

  const handleChange = (isChecked: any, option: any, optionItem: any) => {
    const traitIndex = traits.findIndex((t: any) => t.type === option.label)
    if (traitIndex === -1 && isChecked) {
      traits.push({
        type: option.label,
        values: [optionItem.label],
      })
    }

    if (traitIndex > -1) {
      const attributeIndex = traits[traitIndex].values.findIndex((a: any) => a === optionItem.label)
      if (attributeIndex === -1 && isChecked) {
        traits[traitIndex].values.push(optionItem.label)
      }
      if (attributeIndex > -1 && !isChecked) {
        traits[traitIndex].values.splice(attributeIndex, 1)
        if (traits[traitIndex].values.length === 0) {
          traits.splice(traitIndex, 1)
        }
      }
    }
    setTraits([...traits])
    onChangeTraits(traits)
  }

  return (
    <>
      {options.map((option: any, i: any) => {
        return (
          <Box sx={{ mb: '24px' }} key={option.label}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '16px',
                color: '#1D123F',
                mb: '10px',
              }}
            >
              {option.label}
            </Typography>
            <Box
              sx={{
                maxHeight: indexes.includes(i) ? '100%' : '250px',
                overflow: 'hidden',
              }}
            >
              {option.select
                .filter((select: any) => select.amount)
                .sort((a: any, b: any) => {
                  if (a.label < b.label) {
                    return -1
                  }
                  if (a.label > b.label) {
                    return 1
                  }
                  return 0
                })
                .map((select: any, index: any) => {
                  return (
                    <Select
                      select={select}
                      isChecked={
                        traits.findIndex((t: any) => t.values.findIndex((a: any) => a === select.label) !== -1) !== -1
                      }
                      key={select.label}
                      onChange={(v: any) => handleChange(v.target.checked, option, select)}
                    />
                  )
                })}
            </Box>
            {option.select.length >= 5 && (
              <>
                {indexes.includes(i) ? (
                  <Button
                    disableElevation
                    sx={{
                      borderRadius: '12px',
                      paddingY: { xs: '8px', md: '12.5px' },
                      paddingX: '24px',
                      boxShadow: 'none',
                      width: '100%',
                      color: '#1976d2',
                    }}
                    onClick={() => {
                      const _i: any = indexes.indexOf(i)
                      if (_i > -1) {
                        indexes.splice(_i, 1)
                        setIndexes([...indexes])
                      }
                    }}
                  >
                    Show Less
                  </Button>
                ) : (
                  <Button
                    disableElevation
                    sx={{
                      borderRadius: '12px',
                      paddingY: { xs: '8px', md: '12.5px' },
                      paddingX: '24px',
                      boxShadow: 'none',
                      width: '100%',
                      color: '#1976d2',
                    }}
                    onClick={() => {
                      if (!indexes.includes(i)) {
                        indexes.push(i)
                        setIndexes([...indexes])
                      }
                    }}
                  >
                    Show All
                  </Button>
                )}
              </>
            )}
          </Box>
        )
      })}
    </>
  )
}

export default Option
