import { Auth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from 'cookies-next';
import { Auth as AuthServer } from 'firebase-admin/auth';
import { User, UserState } from './types';

const tokenName = process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string;

type Props = {
  auth: Auth;
  userSSR?: User;
};

export const userSessionState = async (
  auth: AuthServer,
  { req, res }: { req: any; res: any }
) => {
  if (!checkCookies(tokenName, { req, res }))
    return { user: null, error: 'token does not exits' };

  const cookie = getCookie(tokenName, {
    req,
    res,
  }) as string;

  const user: User = await auth
    .verifyIdToken(cookie)
    .then((value) => ({
      user: {
        displayName: value.name,
        email: value.email,
        emailVerified: value.email_verified,
        photoURL: value.picture,
        phoneNumber: value.phone_number,
        providerId: 'firebase',
        uid: value.uid,
        providerData: [
          {
            displayName: value.name,
            email: value.email,
            photoURL: value.picture,
            phoneNumber: value.phone_number,
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
  const [userState, setUserState] = useState<UserState>({
    loading: userSSR ? false : true,
    user: userSSR,
  });

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserState({ loading: false, user });
        removeCookies(tokenName);
        return;
      }

      setCookies(tokenName, await user.getIdToken());
      setUserState({ loading: false, user });
    });

    return () => {
      listener();
    };
  }, []);

  return { user: userState };
};
