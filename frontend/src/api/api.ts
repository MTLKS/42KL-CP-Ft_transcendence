import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

class Api {
  reqInstance: AxiosInstance;

  constructor() {
    this.reqInstance = axios.create({
      baseURL: "http://localhost:3000",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    this.reqInstance.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const { data, status, config } = error.response!;
        switch (status) {
          case 403:
            console.error("not-authorised");
            break;

          case 404:
            console.error("/not-found");
            break;

          case 500:
            console.error("/server-error");
            break;
        }
        return Promise.reject(error);
      }
    );
  }

  updateToken(token: string, newToken: string) {
    this.reqInstance.defaults.headers.common["token"] = `Bearer ${newToken}`;
  }

  get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.put<T>(url, data, config);
  }
}

export default new Api();