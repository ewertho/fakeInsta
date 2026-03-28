import { io } from "socket.io-client";

import { socketUrl } from "./api";

export const socket = io(socketUrl, {
  autoConnect: true,
  timeout: 15_000,
});
