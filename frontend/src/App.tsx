import { useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import Terminal from "./pages/Terminal";
import login, { checkAuth } from "./functions/login";
import HomePage from "./pages/HomePage";
import Profile from "./widgets/Profile/Profile";
import { CookiePopup } from "./components/Popup";
import AxiosResponse from 'axios';



function App() {
  const [logged, setLogged] = useState(false);

  if (!logged)
    checkIfLoggedIn();

  return (
    <PolkaDotContainer>
      {logged ? <HomePage /> : <Login />}
    </PolkaDotContainer>
  )

  function checkIfLoggedIn() {
    let loggin = false;
    document.cookie.split(';').forEach((cookie) => {
      if (cookie.includes('Authorization')) {
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
          console.log((res as any).data);
          document.cookie = `Authorization=${(res as any).data.accessToken};`;
          login();
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}

export default App
