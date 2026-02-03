import { Api } from "../api/Api";


class AuthService {
  constructor() {
    Api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            //call refresh token api
            await this.refreshToken();
            return Api(originalRequest);
          } catch (error) {
            console.log(error);
            window.location.href = "/login";
          }
        }
      },
    );
  }

  async signup(data) {
    return await Api.post("/user/register", data);
  }

  async login(data) {
    return await Api.post("/user/login", data);
  }

  async sendVerificationEmail(email) {
    return await Api.post("/user/send/verification/email", { email });
  }

  async verifyEmail(data) {
    return await Api.patch("/user/verifyEmail", data);
  }

  async profile() {
    return await Api.get("/user/profile");
  }

  async refreshToken() {
    return await Api.post("/user/refreshToken");
  }

  async logout() {
    return await Api.post("/user/logout");
  }

  async search(data) {
    return await Api.get(`/user/search?search=${data}`);
  }
}

export const authService = new AuthService();
