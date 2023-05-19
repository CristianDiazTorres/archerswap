import { useEffect } from 'react'

const useGetDocumentTitlePrice = () => {
  useEffect(() => {
    document.title = 'ArcherSwap - Core Chain'
    // document.title = `ArcherSwap - $${Number(cakePriceUsd).toLocaleString(undefined, {
    //   minimumFractionDigits: 3,
    //   maximumFractionDigits: 3,
    // })}`
  })
}
export default useGetDocumentTitlePrice
