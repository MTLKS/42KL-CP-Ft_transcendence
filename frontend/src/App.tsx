import { PolkaDotContainer } from "./components/Background";
import Login from "./pages/Login";
import Terminal from "./pages/Terminal";

function checkIfLoggedIn() {
  const queryString: string = window.location.search;
  const urlParams: URLSearchParams = new URLSearchParams(queryString);
  let code: { code: string | null } = { code: urlParams.get('code') };

  if (code.code !== null)
    return true;
  return false;
}

function App() {

  const logged = checkIfLoggedIn();

  return (
    <PolkaDotContainer>
      {logged ? <Terminal /> : <Login />}
    </PolkaDotContainer>
  )
}

export default App
