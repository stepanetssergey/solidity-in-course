import React, { useState } from 'react'
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Contract } from '@ethersproject/contracts'
var contractAbi = require("../contracts/deposit.json").abi

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 1337]
});

const RPC_URLS = {
    1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
    4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213"
};


const ConnectMetamask = () => {

    const [deposit, setDeposit] = useState(0)
    const [contractDeposit, setContractDeposit] = useState("")
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

    const handleDepositInput = (e) => {
        setDeposit(parseInt(e.target.value))
    }
    const handleDeposit = async () => {
        const depositContract = new Contract("0x5D3e25eb4278cA23f96C4FfF150eb1514FACb753",
            contractAbi,
            library.getSigner(account).connectUnchecked())
        const depositTrx = await depositContract.addDeposit(deposit) //0xwerrew123321123321123321 msg ->
        //spinner -> notification
        await depositTrx.wait()
        const depositLast = await depositContract.UserDeposit(account);
        setContractDeposit(depositLast.toString())


    }
    return (
        <>
            <div style={{ display: 'flex', gap: '5rem', justifyContent: 'center', padding: '50px' }}>
                <button onClick={handleMetamaskConnect}>
                    {account !== undefined ? account.substring(0, 4) + '...' + account.substring(38, 42) : "Connect metamask"}</button>

                <button onClick={handleWalletConnect}>
                    {account !== undefined ? account.substring(0, 4) + '...' + account.substring(38, 42) : "Wallet Connect"}</button>

            </div>
            <div style={{ display: 'flex', gap: '5rem', justifyContent: 'center', padding: '50px' }}>
                <input type="number" onChange={handleDepositInput} />
                <button onClick={handleDeposit}> Deposit</button>
            </div>
            <div style={{ display: 'flex', gap: '5rem', justifyContent: 'center', padding: '50px' }}>
                {contractDeposit}
            </div>
        </>
    )
}

export default ConnectMetamask;
