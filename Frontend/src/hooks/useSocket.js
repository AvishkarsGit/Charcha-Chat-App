import { getEnvironmentVariables } from "@/environments/environment";
import { io } from "socket.io-client";
let socket = null;
export const getSocket = () => {
  if (!socket) {
    socket = io(getEnvironmentVariables.backendUrl, {
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
