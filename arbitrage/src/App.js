import { useState } from 'react';
import Form from './components/Form';
import Header from './components/Header';
import Prices from './components/Prices';

import factory from './abis/factory.json';
import erc20 from './abis/erc20.json';
import router from './abis/router.json';
import pairAbi from './abis/pair.json';
import getContract from './services/getContract';

import BigNumber from "bignumber.js";

function App() {
  const Factory = getContract(factory.abi, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');

  const [pairAddress, setPairAddress] = useState('');
  const [form, setForm] = useState({
    token0: '',
    token1: ''
  });

  const [tokens, setTokens] = useState([
    { name: '' },
    { name: '' }
  ]);

  const [prices, setPrices] = useState({
    token0: '',
    token1: ''
  });

  async function onSubmit() {
    const response = await Factory.methods.getPair(form.token0, form.token1).call();
    setPairAddress(response);
    const token0Contract = getContract(erc20.abi, form.token0);
    const token1Contract = getContract(erc20.abi, form.token1);
    const token0Name = await token0Contract.methods.name().call();
    const token1Name = await token1Contract.methods.name().call();
    setTokens([{ name: token0Name }, { name: token1Name }]);
  }

  async function handlePrices({ target }) {
    const otherToken = target.name === 'token0' ? 'token1' : 'token0';
    setPrices((state) => ({ ...state, [target.name]: target.value }));
    if (!target.value) return;
    const decimals = await getDecimals();
    const amount = await getAmount(target, decimals);
    setPrices(state => ({ ...state, [otherToken]: (amount / 10 ** decimals[otherToken]).toFixed(2) }));
  }

  async function getAmount(target, decimals) {
    const Router = getContract(router.abi, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');
    const Pair = getContract(pairAbi.abi, pairAddress);
    const reserves = await Pair.methods.getReserves().call();

    const value = new BigNumber(target.value);

    let amount;
    if (target.name === 'token0') {
      amount = await Router.methods.getAmountOut(value.multipliedBy(10 ** decimals.token0), reserves[0], reserves[1]).call();
    } else {
      amount = await Router.methods.getAmountIn(value.multipliedBy(10 ** decimals.token1), reserves[0], reserves[1]).call();
    }
    return amount;
  }

  async function getDecimals() {
    const Token0Contract = getContract(erc20.abi, form.token0);
    const Token1Contract = getContract(erc20.abi, form.token1);
    const token0Decimals = await Token0Contract.methods.decimals().call();
    const token1Decimals = await Token1Contract.methods.decimals().call();
    return { token0: token0Decimals, token1: token1Decimals }
  }

  return (
    <>
      <Header />
      <main className="main container">
        <Form form={form} setForm={setForm} onSubmit={onSubmit} />
        {pairAddress &&
          <Prices tokens={tokens} prices={prices} setPrices={handlePrices} />
        }
      </main>
    </>
  );
}

export default App;
