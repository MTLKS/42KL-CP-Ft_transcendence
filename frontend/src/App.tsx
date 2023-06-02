import { useEffect, useState } from "react";
import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import login, { checkAuth } from "./api/loginAPI";
import HomePage from "./pages/HomePage";
import UserForm from "./pages/UserForm/UserForm";
import { getMyProfile } from "./api/profileAPI";
import { UserData } from "./model/UserData";

function App() {
  const [logged, setLogged] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [updateUser, setUpdateUser] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  let page = <></>;
  if (newUser || updateUser) {
    page = <UserForm userData={userData} isUpdatingUser={updateUser} setIsUpdatingUser={setUpdateUser} />;
  }
  else if (logged) {
    page = <HomePage setUserData={setUserData} setUpdateUser={setUpdateUser} userData={userData} />;
  } else if (loaded) {
    page = <Login />;
  }

  return (
    <PolkaDotContainer>
      {page}
    </PolkaDotContainer>
  )

  async function checkIfLoggedIn() {
    const getProfileRes = await getMyProfile().catch((err) => { });
    if (getProfileRes != null && (getProfileRes.data as UserData).accessToken) {
      setUserData(getProfileRes.data as UserData);
      setLogged(true);
      return;
    }

    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };

    if (code.code) {
      const res = await checkAuth(code.code);
      if (res) {
        if ((res as any).data.accessToken) {
          document.cookie = `Authorization=${(res as any).data.accessToken};`;
        }
        if ((res as any).data.newUser) {
          setUserData((await getMyProfile()).data as UserData);
          setNewUser(true);
        } else {
          login();
        }
        return;
      }
    }
    setLoaded(true);
  }
}

export default App
