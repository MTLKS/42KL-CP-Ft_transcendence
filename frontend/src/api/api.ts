import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

class Api {
  reqInstance: AxiosInstance;

  constructor() {
    this.reqInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
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
    this.reqInstance.interceptors.request.use(
      (config) => {
        const token = document.cookie
          .split(";")
          .find((cookie) => cookie.includes("Authorization"))
          ?.split("=")[1];
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error) => {
        if (error.response.status === 403) {
          document.cookie = "Authorization=;";
          window.location.assign("/");
        }
      }
    );
  }

  updateToken(token: string, newToken: string) {
    this.reqInstance.defaults.headers.common[token] = newToken;
  }

  get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.post<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.patch<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.reqInstance.put<T>(url, data, config);
  }
}

export default new Api();
