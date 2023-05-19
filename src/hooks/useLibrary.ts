import { useContext } from 'react'
import { LibraryContext } from 'contexts/Web3ReactLibraryContext'

const useLibrary = () => {
  const library = useContext(LibraryContext)
  return { library }
}

export default useLibrary
