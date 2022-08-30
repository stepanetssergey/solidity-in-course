import React from 'react'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import ConnectMetamask from "./components/ConnetMetamask"

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

function App() {

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ConnectMetamask />
        </Web3ReactProvider>
    );
}

export default App;
