import { Socket, io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_URL as string;

export type Events = "userStatus" | "userDisconnect";

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

  sendMessages<T>(data: T) {
    this.socket.emit("userConnect", data);
  }

  disconnect() {
    this.socket.on("disconnect", () => {
      console.log(this.socket.id);
    });
  }
}

export default new SocketApi();
