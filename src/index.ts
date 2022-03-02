import { Auth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from 'cookies-next';
import { Auth as AuthServer } from 'firebase-admin/auth';
import { UserServer, UserClient, UserState } from './types';

const tokenName = process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string;

type Props = {
  auth: Auth;
  userSSR?: UserServer;
};

type UserSessionState = Promise<{
  user: null | UserServer;
  error: null | string;
}>;

export const userSessionState = async (
  auth: AuthServer,
  { req, res }: { req: any; res: any }
): UserSessionState => {
  if (!checkCookies(tokenName, { req, res }))
    return { user: null, error: 'token does not exits' };

  const cookie = getCookie(tokenName, {
    req,
    res,
  }) as string;

  const user = await auth
    .verifyIdToken(cookie)
    .then((value) => ({
      user: {
        displayName: value.name,
        email: value.email ?? null,
        emailVerified: value.email_verified ?? null,
        photoURL: value.picture ?? null,
        phoneNumber: value.phone_number ?? null,
        providerId: 'firebase',
        uid: value.uid,
        providerData: [
          {
            displayName: value.name,
            email: value.email ?? null,
            photoURL: value.picture ?? null,
            phoneNumber: value.phone_number ?? null,
            providerId: value.firebase.sign_in_provider,
            uid: value.uid,
          },
        ],
      },
      error: null,
    }))
    .catch(() => ({ user: null, error: 'token is invalid' }));

  return user;
};

export const useAuth = ({ auth, userSSR }: Props) => {
  const [user, setUser] = useState<UserState>({
    loading: userSSR ? false : true,
    user: (userSSR as UserClient) ?? null,
  });

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (value) => {
      if (!user) {
        setUser({ loading: false, user: value as UserClient });
        removeCookies(tokenName);

        return;
      }

      setCookies(tokenName, await value?.getIdToken());
      setUser({ loading: false, user: value as UserClient });
    });

    return () => {
      listener();
    };
  }, []);

  return { ...user };
};
