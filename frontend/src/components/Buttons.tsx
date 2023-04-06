import React from 'react'
import login from '../functions/login'

function Button() {
  return (
    <button className='button' type='button' onClick={ login }>
        Login
    </button>
  )
}

export default Button