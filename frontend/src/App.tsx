import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import Terminal from "./pages/Terminal";
import { useEffect, useState } from "react";

function App() {

  const logged = checkIfLoggedIn();
  return (
    <div className=' bg-background dotted-texture h-screen w-screen'>
      {logged ? <Terminal /> : <Login />}
    </div>
  )

  function checkIfLoggedIn() {
    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };

    if (code.code !== null)
      return true;
    return false;
  }
}

export default App
