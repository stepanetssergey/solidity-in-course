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
  const UniswapFactory = getContract(factory.abi, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
  const SushiswapFactory = getContract(factory.abi, '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac');

  const [uniswapPairAddress, setUniswapPairAddress] = useState('');

  const [sushiswapPairAddress, setSushiswapPairAddress] = useState('');

  const [form, setForm] = useState({
    token0: '',
    token1: ''
  });

  const [tokens, setTokens] = useState([
    { name: '' },
    { name: '' }
  ]);

  const [prices, setPrices] = useState({
    uniswap: { token0: '', token1: '' },
    sushiswap: { token0: '', token1: '' }
  });

  async function onSubmit() {
    const uniswapResponse = await UniswapFactory.methods.getPair(form.token0, form.token1).call();
    const sushiswapResponse = await SushiswapFactory.methods.getPair(form.token0, form.token1).call();
    setUniswapPairAddress(uniswapResponse);
    setSushiswapPairAddress(sushiswapResponse);
    const token0Contract = getContract(erc20.abi, form.token0);
    const token1Contract = getContract(erc20.abi, form.token1);
    const token0Name = await token0Contract.methods.name().call();
    const token1Name = await token1Contract.methods.name().call();
    setTokens([{ name: token0Name }, { name: token1Name }]);
  }

  async function handlePrices({ target }, type) {
    const otherToken = target.name === 'token0' ? 'token1' : 'token0';
    const otherType = type === 'uniswap' ? 'sushiswap' : 'uniswap';

    setPrices((state) => ({
      ...state,
      [type]: {
        ...state[type],
        [target.name]: target.value
      },
      [otherType]: {
        ...state[otherType],
        [target.name]: target.value
      }
    }));

    if (!target.value) return;

    const decimals = await getDecimals();
    const amounts = await getAmounts(target, decimals);

    setPrices(state => ({
      ...state,
      [type]: {
        ...state[type],
        [otherToken]: (amounts[type] / 10 ** decimals[otherToken]).toFixed(2)
      },
      [otherType]: {
        ...state[otherType],
        [otherToken]: (amounts[otherType] / 10 ** decimals[otherToken]).toFixed(2)
      }
    }));
  }

  async function getAmounts(target, decimals) {
    const UniswapRouter = getContract(router.abi, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');
    const SushiswapRouter = getContract(router.abi, '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F');

    const uniswapReserves = await getReserves(uniswapPairAddress);
    const sushiswapReserves = await getReserves(sushiswapPairAddress);

    const value = new BigNumber(target.value);

    let uniswap;
    let sushiswap;

    if (target.name === 'token0') {
      uniswap = await getAmountOut(UniswapRouter, value, decimals, uniswapReserves);
      sushiswap = await getAmountOut(SushiswapRouter, value, decimals, sushiswapReserves);
    } else {
      uniswap = await getAmountIn(UniswapRouter, value, decimals, uniswapReserves);
      sushiswap = await getAmountIn(SushiswapRouter, value, decimals, sushiswapReserves);
    }

    return { uniswap, sushiswap };
  }

  async function getAmountIn(Router, value, decimals, reserves) {
    return Router.methods.getAmountIn(value.multipliedBy(10 ** decimals.token1), reserves[0], reserves[1]).call();
  }

  async function getAmountOut(Router, value, decimals, reserves) {
    return Router.methods.getAmountOut(value.multipliedBy(10 ** decimals.token0), reserves[0], reserves[1]).call();
  }

  async function getReserves(pairAddress) {
    const Pair = getContract(pairAbi.abi, pairAddress);
    return Pair.methods.getReserves().call();
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
        {(uniswapPairAddress || sushiswapPairAddress) &&
          <Prices tokens={tokens} prices={prices} setPrices={handlePrices} />
        }
      </main>
    </>
  );
}

export default App;
