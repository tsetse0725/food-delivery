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

/* 🔐 User-ийн төрөл */
type UserData = {
  userId: string;
  email: string;
  address?: string;
  role: "USER" | "ADMIN"; // 🆕 role нэмэгдсэн
};

type AuthContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  tokenChecker: (token: string) => Promise<boolean>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* 🔗 API base URL */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/* 🔐 Provider */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ✅ Token-г шалгах */
  const tokenChecker = async (token: string): Promise<boolean> => {
    try {
      const res = await axios.post(
        `${API_BASE}/auth/verify`,
        { token },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { destructToken } = res.data;

      setUser({
        userId: destructToken.userId,
        email: destructToken.email,
        address: destructToken.address,
        role: destructToken.role, // 🆕 энд нэмэгдсэн
      });

      return true;
    } catch (err) {
      setUser(null);
      return false;
    }
  };

  /* ✅ Token localStorage-с унших */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    tokenChecker(token).then((isValid) => {
      if (!isValid) {
        localStorage.removeItem("token");
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

/* ➕ Hook */
export const useAuth = () => useContext(AuthContext);
