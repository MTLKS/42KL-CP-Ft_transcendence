import PromptField from "./PromptField/PromptField";
import Button from "./components/Buttons";
import Title from "./components/Title";
import "./index.css";
import Login from "./login/Login";
import Terminal from "./login/Terminal";
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
    const code: any = JSON.parse(`{ "code" : "${urlParams.get('code')}" }`);

    await sleep(1000);
    if (code.code !== "null")
      setLoggedIn(true);
    else 
      setLoggedIn(false);
  }
}

export default App
