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

type UserData = { userId: string; email: string };

type AuthContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  tokenChecker: (token: string) => Promise<boolean>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ① Суурь URL нэг удаа тодорхойлно
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ② Token шалгах функц
  const tokenChecker = async (token: string): Promise<boolean> => {
    try {
      const res = await axios.post(
        `${API_BASE}/auth/verify`,
        { token }, // ↙️ backend нь body-гоор авдаг бол үлдээнэ
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ↙️ header-ээр ч дамжуулчихъя
          },
        }
      );

      // backend-ээс { destructToken: { userId, email } } ирдэг гэж төсөөлөв
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
