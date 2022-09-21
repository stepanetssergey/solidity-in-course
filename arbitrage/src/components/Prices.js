import React from 'react'

export default function Prices({ prices, setPrices, tokens }) {
  return (
    <div className='form form--prices'>
      <h1 className="form__title">Prices</h1>
      <input type="number" className="form__input" name="token0" value={prices.token0} placeholder={tokens[0].name} onChange={setPrices} />
      <input type="number" className="form__input" name="token1" value={prices.token1} placeholder={tokens[1].name} onChange={setPrices} />
    </div>
  )
}
