import React from 'react'

export default function Prices({ prices, setPrices, tokens }) {
  return (
    <div className='form form--prices'>
      <h1 className="form__title">Prices</h1>
      <div className="form__column">
        <label className="form__label">Uniswap {tokens[0].name}</label>
        <input type="number" className="form__input" name="token0" value={prices.uniswap.token0} placeholder={tokens[0].name} onChange={(e) => setPrices(e, 'uniswap')} />
        <label className="form__label form__label--mt">Uniswap {tokens[1].name}</label>
        <input type="number" className="form__input" name="token1" value={prices.uniswap.token1} placeholder={tokens[1].name} onChange={(e) => setPrices(e, 'uniswap')} />
      </div>
      <div className="form__column">
        <label className="form__label">Sushiswap {tokens[0].name}</label>
        <input type="number" className="form__input" name="token0" value={prices.sushiswap.token0} placeholder={tokens[0].name} onChange={(e) => setPrices(e, 'sushiswap')} />
        <label className="form__label form__label--mt">Sushiswap {tokens[1].name}</label>
        <input type="number" className="form__input" name="token1" value={prices.sushiswap.token1} placeholder={tokens[1].name} onChange={(e) => setPrices(e, 'sushiswap')} />
      </div>
    </div>
  )
}
