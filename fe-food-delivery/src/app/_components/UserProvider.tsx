"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type UserData = {
  userId: string;
  email: string;
};

type AuthContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  tokenChecker: (token: string) => Promise<boolean>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const tokenChecker = async (token: string): Promise<boolean> => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"; // ✅ fallback
      const res = await axios.post(`${baseURL}/auth/verify`, { token }); // ✅ зассан

      const { destructToken } = res.data;

      setUser({
        userId: destructToken.userId,
        email: destructToken.email,
      });

      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    tokenChecker(token).then((isValid) => {
      if (!isValid) {
        localStorage.removeItem("token");
        setUser(null);
        router.replace("/login");
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, tokenChecker, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
