import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    //check user currentuser = null
    //localstorage
    if (currentUser === null) {
      if (localStorage.getItem("session_auth") === true) {
        let obj = {
          login: localStorage.getItem("session_auth"),
          uid: localStorage.getItem("session_userID"),
          emailID: localStorage.getItem("session_email"),
        };
        setCurrentUser(obj);
      }
    }
  }, [currentUser]);
  return (
    <AuthContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </AuthContext.Provider>
  );
};
