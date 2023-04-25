import { Socket, io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_URL as string;

export type Events =
  | "userConnect"
  | "userDisconnect"
  | "changeStatus"
  | "statusRoom";

class SocketApi {
  socket: Socket;
  constructor() {
    const URI = baseURL;
    console.log("uri", URI);
    this.socket = io(URI, {
      extraHeaders: {
        Authorization:
          document.cookie
            .split(";")
            .find((cookie) => cookie.includes("Authorization"))
            ?.split("=")[1] ?? "",
      },
    });
  }

  connect() {
    this.socket.on("connect", () => {
      console.log(this.socket.id);
    });
  }

  listen<T>(event: Events, callBack: (data: T) => void) {
    this.socket.on(event, callBack);
  }

  removeListener(event: Events) {
    this.socket.off(event);
  }

  sendMessages<T>(event: Events, data: T) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default new SocketApi();
