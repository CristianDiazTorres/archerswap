import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'


const LibraryContext = React.createContext({ library: null })

const Web3ReactLibraryProvider = ({ children, library }) => {
    return (
        <LibraryContext.Provider value={{ library }}>
            <Web3ReactProvider getLibrary={library}>
                {children}
            </Web3ReactProvider>
        </LibraryContext.Provider>
    )
}

export { LibraryContext, Web3ReactLibraryProvider}
