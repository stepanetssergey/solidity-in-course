import React from 'react'

export default function Form({ form, setForm, onSubmit }) {
  function handleChange ({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h1 className="form__title">Get pair</h1>
      <input type="text" name="token0" className='form__input' value={form.token0} onChange={handleChange} placeholder="Token 1 Address" />
      <input type="text" name="token1" className='form__input' value={form.token1} onChange={handleChange} placeholder="Token 2 Address" />
      <button type="submit" className="form__button button">Submit</button>
    </form>
  )
}
