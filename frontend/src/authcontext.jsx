import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}; //this will allow us to use the context in any component by calling useAuth()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId"); //chceck if user is currently logged in by looking for userId in localStorage
    if (userId) {
      setCurrentUser({ id: userId });
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
