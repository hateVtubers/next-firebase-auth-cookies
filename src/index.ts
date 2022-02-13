import {
  Auth,
  onAuthStateChanged,
  signOut as logout,
  User,
  UserCredential,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from 'cookies-next';
import { Auth as AuthServer, DecodedIdToken } from 'firebase-admin/auth';

export const signIn = async ({ user }: UserCredential) => {
  setCookies(
    process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string,
    await user.getIdToken()
  );
  return user;
};

export const signOut = async (auth: Auth) => {
  await logout(auth);
  removeCookies(process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string);
};

export const getSessionUser = async (
  auth: AuthServer,
  { req, res }: { req: any; res: any }
): Promise<DecodedIdToken | null | undefined> => {
  if (
    !checkCookies(process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string, {
      req,
      res,
    })
  )
    return;

  const cookie = getCookie(process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string, {
    req,
    res,
  }) as string;

  const user = await auth
    .verifyIdToken(cookie)
    .then((value) => value)
    .catch(() => null);

  return user;
};

type Props = {
  auth: Auth;
  userSSR?: DecodedIdToken | null;
};

export const useAuth = ({ auth, userSSR }: Props) => {
  const [user, setUser] = useState<null | undefined | DecodedIdToken | User>(
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

    return () => {
      listener();
    };
  }, []);

  return { user };
};
