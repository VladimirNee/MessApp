import { io } from "socket.io-client";

const socket = (user) =>
  new io(import.meta.env.VITE_SOME_KEY, {
    autoConnect: true,
    withCredentials: true,
    auth: {
      token: user.token,
    },
  });

export default socket;
