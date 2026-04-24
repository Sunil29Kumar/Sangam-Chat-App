import {createContext, useState} from "react";
import {
  isAuthenticated,
  loginAuth,
  logoutAuth,
  sendOTPAuth,
  signupAuth,
  VerifyOTP,
} from "../api/authApi";

interface User {
  id?: string;
  name?: string;
  email?: string;
  profilePic?: string;
  isOnline?: boolean;
  loginWith?: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  isAuth: boolean | null;
  setIsAuth: (auth: boolean | null) => void;
  user: User;
  signup: (name: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  checkAuthentication: () => Promise<void>;
  sendOTP: (name: string, email: string, password: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({children}: {children: React.ReactNode}) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<User>({});

  const checkAuthentication = async () => {
    try {
      const data = await isAuthenticated();
      console.log(data);
      
      if (data?.success) {
        setIsAuth(true);
        setUser(data.user);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.log("Error while checking Authentication: ", error);
      setIsAuth(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupAuth(name, email, password);
    return data;
  };

  const sendOTP = async (name: string, email: string, password: string) => {
    const data = await sendOTPAuth(name, email, password);
    return data;
  };

  const verifyOTP = async (email: string, otp: string) => {
    const data = await VerifyOTP(email, otp);
    return data;
  };

  const login = async (email: string, password: string) => {
    const data = await loginAuth(email, password);
    if (data?.success) setIsAuth(true);
    return data;
  };

  const logout = async () => {
    const data = await logoutAuth();
    setIsAuth(false);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        isAuth,
        setIsAuth,
        user,
        checkAuthentication,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
