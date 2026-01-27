import { getEnvironmentVariables } from "@/environments/environment";
import axios from "axios";
export const Api = axios.create({
  baseURL: getEnvironmentVariables.backendUrl,
  withCredentials: true,
});
