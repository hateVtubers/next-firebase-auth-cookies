import { Auth, signOut as logout, UserCredential } from "firebase/auth";
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from "cookies-next";
import { Auth as AuthServer } from "firebase-admin/auth";

export type User = {
  displayName: string;
  email: string | undefined;
  emailVerified: boolean;
  photoURL: string | undefined;
  uid: string;
  providerData: {
    displayName: string;
    email: string | undefined;
    photoURL: string | undefined;
    providerId: string;
    uid: string;
    identities: {
      [key: string]: any;
    };
  };
} | null | undefined;

export const signIn = async ({ user }: UserCredential) => {
  setCookies(
    process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string,
    await user.getIdToken()
  );
  return user;
};

export const signOut = (auth: Auth): void => {
  logout(auth);
  removeCookies(process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string);
};

export const getSessionUser = async (
  auth: AuthServer,
  { req, res }: { req: any; res: any }
): Promise<User> => {
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
    .then(
      ({
        name,
        email,
        emailVerified,
        picture,
        user_id,
        firebase: { sign_in_provider, identities },
      }) => ({
        displayName: name as string,
        email,
        emailVerified: emailVerified as boolean,
        photoURL: picture,
        uid: user_id as string,
        providerData: {
          displayName: name as string,
          email,
          photoURL: picture,
          providerId: sign_in_provider,
          uid: user_id as string,
          identities,
        },
      })
    )
    .catch(() => null);

  return user;
};
