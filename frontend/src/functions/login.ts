// assign is better than replace because it doesn't reset the history

import Api from "../api/api";

interface IResponse {
  redirectUrl: string;
}

export function checkAuth(code: string | null) {
  return Api.post("/auth", {
    code: code,
  });
}

async function login() {
  Api.updateToken("Banana", "ok");
  Api.updateToken("Authorization", document.cookie.split("=")[1]);
  Api.get<IResponse>("/auth").then((res) => {
    console.log(res.data.redirectUrl);
    console.log(document.cookie);
    window.location.assign(res.data.redirectUrl);
  });
}

export default login;
