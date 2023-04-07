import React from 'react'
import { useState } from "react";
import Button from '../components/Buttons';
import Title from '../components/Title';
import login from '../functions/login';

function Login() {

  return (
    <div>
      <Title />
      <Button title='Login' onClick={login} />
    </div>
  )
}

export default Login