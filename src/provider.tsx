import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { setCookies, removeCookies } from "cookies-next";

// @ts-ignore
const AuthContext = createContext<{ user: User | null | undefined }>();

export const AuthProvider = ({
  children,
  auth,
}: {
  children: ReactNode;
  auth: Auth;
}) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(user);
        removeCookies(process.env.NEXT_PUBLIC_FOREBASE_TOKEN as string);
        return;
      }

      setCookies(
        process.env.NEXT_PUBLIC_FOREBASE_TOKEN as string,
        await user.getIdToken()
      );
      setUser(user);
    });

    return listener;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
