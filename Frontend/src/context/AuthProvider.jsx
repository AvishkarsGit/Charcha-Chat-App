import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Api } from "@/services/api/Api";
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await Api.get("/user/me");
      if (response?.data?.success) {
        setUser(response?.data?.data);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (err) {
      console.log(err);
      setLoggedIn(false);
    } finally {
      setLoader(false);
    }
  };

  const value = {
    isLoggedIn,
    loader,
    setLoggedIn,
    user,
    setUser,
    setLoader,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
