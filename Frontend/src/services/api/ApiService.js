import axios from "axios";
import { getEnvironmentVariable } from "../../environments/environments.js";
// import authService from "../auth/AuthService.js";

export const Api = axios.create({
  baseURL: `${getEnvironmentVariable.server_url}`,
  withCredentials: true,
});

