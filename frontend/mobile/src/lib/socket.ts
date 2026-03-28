import { io } from "socket.io-client";

export const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL ?? "http://10.0.2.2:3333", {
  autoConnect: true,
});
