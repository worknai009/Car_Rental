import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, carRegisterAuth } from "../../utils/carRegisterApi";

const CarRegisterAuthContext = createContext(null);

const TOKEN_KEY = "carRegisterToken";
const USER_KEY = "carRegisterUser";

export const CarRegisterAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await apiRequest(carRegisterAuth.login, {
        method: "POST",
        body: { email, password },
      });

      const newToken = data?.token;
      const newUser = data?.user || data?.data?.user || null;

      if (!newToken) throw new Error("Token not found in login response.");

      setToken(newToken);
      setUser(newUser);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, phone }) => {
    setLoading(true);
    try {
      const data = await apiRequest(carRegisterAuth.register, {
        method: "POST",
        body: { name, email, password, phone },
      });

      // some APIs return token on register, some don't
      const newToken = data?.token || "";
      const newUser = data?.user || data?.data?.user || null;

      if (newToken) {
        setToken(newToken);
        setUser(newUser);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const refreshMe = async () => {
    if (!token) return null;
    const data = await apiRequest(carRegisterAuth.me, { token });
    const me = data?.user || data?.data?.user || data;
    setUser(me);
    return me;
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, refreshMe }),
    [token, user, loading]
  );

  return (
    <CarRegisterAuthContext.Provider value={value}>
      {children}
    </CarRegisterAuthContext.Provider>
  );
};

export const useCarRegisterAuth = () => {
  const ctx = useContext(CarRegisterAuthContext);
  if (!ctx) throw new Error("useCarRegisterAuth must be used inside CarRegisterAuthProvider");
  return ctx;
};
