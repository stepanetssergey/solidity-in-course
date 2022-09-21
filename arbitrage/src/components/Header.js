import React from 'react'
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 1337, 137],
});

export default function Header() {
  const { account, active, activate, deactivate } = useWeb3React();

  function connectWallet() {
    if (!active) {
      activate(injected);
    } else {
      deactivate();
    }
  }

  return (
    <header className="header container">
      <button className="button" onClick={connectWallet}>
        {active ? account : 'Connect wallet'}
      </button>
    </header>
  )
}
