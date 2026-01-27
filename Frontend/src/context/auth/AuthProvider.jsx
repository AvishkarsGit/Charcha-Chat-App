import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Api } from "../../services/api/ApiService";

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/user/profile");

      if (response?.data?.success) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const values = {
    isLoggedIn,
    setIsLoggedIn,
    loading,
  };
  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
