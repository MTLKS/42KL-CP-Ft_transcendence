import { useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import login, { checkAuth } from "./functions/login";
import HomePage from "./pages/HomePage";
import AxiosResponse from 'axios';
import MouseCursor from "./components/MouseCursor";

function App() {
  const [logged, setLogged] = useState(false);

  if (!logged)
    checkIfLoggedIn();

  return (
    <PolkaDotContainer>
      <MouseCursor>
        {logged ? <HomePage /> : <Login />}
      </MouseCursor>
    </PolkaDotContainer>
  )

  function checkIfLoggedIn() {
    let loggin = false;
    document.cookie.split(';').forEach((cookie) => {
      if (cookie.includes('access_token')) {
        setLogged(true);
        loggin = true;
      }
    });
    if (loggin) return;

    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };

    if (code.code) {
      checkAuth(code.code).then((res) => {
        if (res) {
          console.log((res as any).data.access_token);
          document.cookie = `access_token=${(res as any).data.access_token};`;
          login();
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}

export default App
