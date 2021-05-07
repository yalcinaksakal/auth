import { createContext, useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = createContext({
  token: null,
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
});

const calculateRemainingTime = expirationTime => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  return adjExpirationTime - currentTime;
};

const retriveStoredToken = () => {
  const localData = localStorage.getItem("token");

  if (!localData) return { initialToken: null, remainingTime: null };

  const { token, expirationTime } = JSON.parse(localStorage.getItem("token"));

  const remainingTime = calculateRemainingTime(expirationTime);

  if (remainingTime < 60000) {
    localStorage.removeItem("token");
    return { initialToken: null, remainingTime: null };
  }
  return { initialToken: token, remainingTime };
};

export const AuthContextProvider = props => {
  const { initialToken, remainingTime } = retriveStoredToken();
  const [token, setToken] = useState(initialToken);
  const isLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    if (logoutTimer) clearTimeout(logoutTimer);
  }, []);

  useEffect(() => {
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  }, [remainingTime, logoutHandler]);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", JSON.stringify({ token, expirationTime }));
    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
    // setTimeout(logoutHandler, 3000);
  };

  const contextValue = {
    token,
    isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
