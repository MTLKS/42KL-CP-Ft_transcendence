// assign is better than replace because it doesn't reset the history

import Api from "./api";

interface IResponse {
  redirectUrl: string;
}

const GOOGLE_REDIRECT = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173&scope=email%20profile&client_id=358700543641-pjnsv89f654obbthp4u9rcq3djg315p4.apps.googleusercontent.com";

export function checkAuth(code: string | null) {
  return Api.post("/auth", {
    code: code,
  });
}

export async function login(intra: boolean = true) {
  Api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  if (intra)
    Api.get<IResponse>("/auth").then((res) => { window.location.assign(res.data.redirectUrl); })
  else
    window.location.assign(GOOGLE_REDIRECT);
}

export async function googleLogin() {
  Api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  /**
   * DO NOT REMOVE THIS - FOR TESTING PURPOSES
   * Api.get<IResponse>("/auth/google").then((res) => { window.location.assign(res.data.redirectUrl); })
   */
  window.location.assign(GOOGLE_REDIRECT);
}
