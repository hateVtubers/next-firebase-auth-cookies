import React, { useEffect, useState } from "react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { User as UserServer } from "./index";
import { setCookies, removeCookies } from "cookies-next";

export const useAuth = ({
  userSSR,
  auth,
}: {
  userSSR?: UserServer;
  auth: Auth;
}) => {
  const [user, setUser] = useState<User | null | undefined | UserServer>(
    userSSR
  );

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(user);
        removeCookies(process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string);
        return;
      }

      setCookies(
        process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string,
        await user.getIdToken()
      );
      setUser(user);
    });

    return listener;
  }, []);

  return user;
};
