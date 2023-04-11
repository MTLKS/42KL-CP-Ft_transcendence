import { useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import Terminal from "./pages/Terminal";
import { checkAuth } from "./functions/login";
import HomePage from "./pages/HomePage";
import Profile from "./widgets/Profile";
import { CookiePopup } from "./components/Popup";



function App() {
  const [logged, setLogged] = useState(false);

  if(!logged)
   checkIfLoggedIn();

  return (
    <PolkaDotContainer>
      {logged ? <HomePage/>: <Login />}
    </PolkaDotContainer>
  )

  async function checkIfLoggedIn() {
    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };
    
    if (code.code) {
      setLogged(true);
      // await checkAuth(code.code).then((res) => {
      //   if (res) {
      //     console.log(res);
      //   }
      // })
    }
  }
}

export default App
