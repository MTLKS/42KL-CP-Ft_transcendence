import { useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import login, { checkAuth } from "./functions/login";
import HomePage from "./pages/HomePage";
import AxiosResponse from 'axios';
import MouseCursor from "./components/MouseCursor";
import UserForm from "./pages/UserForm/UserForm";
import { toDataUrl } from "./functions/toDataURL";
import { UserData } from "./modal/UserData";
import { getMyProfile } from "./functions/profile";

let user = {
  intraId: 106435,
  userName: "Ricky",
  intraName: "wricky-t",
  elo: 999,
  accessToken: "asdfasdfasdfadsf",
  avatar: "https://cdn.intra.42.fr/users/5452393b87392f586be0b0fe37d5f9c1/large_zah.jpg",
  tfaSecret: null,
}

let userData: UserData = {
  intraId: 106435,
  userName: "Ricky",
  intraName: "wricky-t",
  elo: 999,
  accessToken: "",
  avatar: "",
  tfaSecret: null,
};

function App() {
  const [logged, setLogged] = useState(false);
  const [newUser, setNewUser] = useState(false);

  let page = <Login />;
  if (newUser) {
    page = <UserForm userData={userData} />;
  }
  else if (logged) {
    page = <HomePage />;
  }

  if (!logged)
    checkIfLoggedIn();
  return (
    <PolkaDotContainer>
      <MouseCursor>
        {page}
      </MouseCursor>
    </PolkaDotContainer>
  )

  function checkIfLoggedIn() {
    let loggin = false;

    getMyProfile().then((res) => {
      if (res.data.accessToken) {
        setLogged(true);
        loggin = true;
      }
    }).catch((err) => {
      console.log(err);
      setLogged(false);
    });

    if (loggin) return;

    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };

    if (code.code) {
      checkAuth(code.code).then(async (res) => {
        if (res) {
          console.log(res);
          console.log((res as any).data.accessToken);
          localStorage.setItem('Authorization', (res as any).data.accessToken);
          if ((res as any).data.accessToken)
            document.cookie = `Authorization=${(res as any).data.accessToken};`;
          if ((res as any).data.newUser) {
            userData = (await getMyProfile()).data;
            setNewUser(true);
          }
          else
            login();

        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}

export default App
