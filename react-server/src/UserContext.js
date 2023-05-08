import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    //check user currentuser = null
    //localstorage
    console.log("local: ", localStorage["session_auth"]);

    if (localStorage["session_auth"] == "true") {
      let obj = {
        login: localStorage["session_auth"],
        uid: localStorage["session_userID"].split('"')[1],
        emailID: localStorage["session_email"].split('"')[1],
      };
      setCurrentUser(obj);
      console.log(obj);
      console.log("current: ", currentUser);
    }
  }, []);
  return (
    <AuthContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </AuthContext.Provider>
  );
};
