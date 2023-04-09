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
