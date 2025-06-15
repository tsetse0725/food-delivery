// app/_components/UserProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

type UserData = {
  userId: string;
};

type AuthContextType = {
  user: UserData | null;
  tokenChecker: (token: string) => Promise<boolean>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const tokenChecker = async (token: string): Promise<boolean> => {
    try {
      const res = await axios.post("http://localhost:8000/verify", { token });
      const { destructToken } = res.data;
      setUser({ userId: destructToken.userId });
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    tokenChecker(token).finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, tokenChecker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
