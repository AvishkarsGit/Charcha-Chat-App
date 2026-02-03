import { getEnvironmentVariables } from "@/environments/environment";
import { io } from "socket.io-client";
export const useSocket = () => {
  return io(getEnvironmentVariables.backendUrl);
};
