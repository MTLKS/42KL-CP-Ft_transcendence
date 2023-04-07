import PromptField from "./PromptField/PromptField";
import Button from "./components/Buttons";
import Title from "./components/Title";
import "./index.css";
import Login from "./pages/Login";
import Terminal from "./pages/Terminal";
import { useEffect, useState } from "react";
import sleep from "./functions/sleep";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  newFunction();
  return (
    <div className='bg-gray-900 h-screen w-screen font-'>
      {loggedIn ? <Terminal /> : <Login />}
    </div>
  )

  async function newFunction() {
    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };
    if (code.code !== "null")
      setLoggedIn(true);
    else
      setLoggedIn(false);
  }
}

export default App
