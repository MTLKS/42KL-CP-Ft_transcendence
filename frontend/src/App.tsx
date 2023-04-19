import { useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import login, { checkAuth } from "./functions/login";
import HomePage from "./pages/HomePage";
import AxiosResponse from 'axios';
import MouseCursor from "./components/MouseCursor";
import UserForm from "./pages/UserForm/UserForm";
import { toDataUrl } from "./functions/toDataURL";

let user = {
  id: "1",
  name: "johnny doe",
  intraId: "johndoe",
  avatarURL: "https://cdn.intra.42.fr/users/5452393b87392f586be0b0fe37d5f9c1/large_zah.jpg",
}

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
          console.log(res);
          console.log((res as any).data.accessToken);
          localStorage.setItem('Authorization', (res as any).data.accessToken);
          if ((res as any).data.accessToken)
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
