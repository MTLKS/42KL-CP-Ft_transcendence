import { forwardRef, useEffect, useRef, useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import login, { checkAuth } from "./functions/login";
import HomePage from "./pages/HomePage";
import AxiosResponse from 'axios';
import UserForm from "./pages/UserForm/UserForm";
import { getMyProfile } from "./functions/profile";
import { UserData } from "./model/UserData";

function App() {
  const [logged, setLogged] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [userData, setUserData] = useState<UserData>({} as UserData);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  let page = <Login />;
  if (newUser) {
    page = <UserForm userData={userData} />;
  }
  else if (logged) {
    page = <HomePage setNewUser={setNewUser} setUserData={setUserData} userData={userData} />;
  }

  return (
    <PolkaDotContainer>
      {page}
    </PolkaDotContainer>
  )

  function checkIfLoggedIn() {
    let loggin = false;

    getMyProfile().then((res) => {
      if ((res.data as UserData).accessToken) {
        setUserData(res.data as UserData);
        setLogged(true);
        loggin = true;
      }
    }).catch((err) => {
      setLogged(false);
    });

    if (loggin) return;

    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };

    if (code.code) {
      checkAuth(code.code).then(async (res) => {
        if (res) {
          localStorage.setItem('Authorization', (res as any).data.accessToken);
          if ((res as any).data.accessToken) {
            document.cookie = `Authorization=${(res as any).data.accessToken};`;
          }
          if ((res as any).data.newUser) {
            setUserData((await getMyProfile()).data as UserData);
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
