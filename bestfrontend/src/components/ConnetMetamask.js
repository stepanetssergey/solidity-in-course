import React from 'react'
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 1337]
});

const RPC_URLS = {
    1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
    4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213"
};


const ConnectMetamask = () => {


    const context = useWeb3React()
    const { account, library, activate, deactivate } = context;
    const handleMetamaskConnect = async () => {
        if (account === undefined) {
            await activate(injected)
        } else {
            deactivate()
        }
    }

    const handleWalletConnect = async () => {
        var error;
        var walletconnectNow = new WalletConnectConnector({
            rpc: { 4: 'https://rinkeby.infura.io/v3/c7f74b7feee44d2882a7d6a845b91f25' },
            bridge: "https://bridge.walletconnect.org",
            qrcode: true,
            pollingInterval: 12000,
        });
        await activate(walletconnectNow, (e) => {
            error = e.message;
        });
    }
    return (
        <div style={{ display: 'flex', gap: '5rem', justifyContent: 'center', padding: '50px' }}>
            <button onClick={handleMetamaskConnect}>
                {account !== undefined ? account.substring(0, 4) + '...' + account.substring(38, 42) : "Connect metamask"}</button>

            <button onClick={handleWalletConnect}>
                {account !== undefined ? account.substring(0, 4) + '...' + account.substring(38, 42) : "Wallet Connect"}</button>
        </div>
    )
}

export default ConnectMetamask;
