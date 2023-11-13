import { io } from "socket.io-client";

const socket = (user) =>
  new io(import.meta.env.VITE_SERVER_URL, {
    autoConnect: true,
    withCredentials: true,
    auth: {
      token: user.token,
    },
  });

export default socket;
