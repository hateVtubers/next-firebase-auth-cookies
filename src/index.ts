import { Auth, signOut as logout, User, UserCredential } from "firebase/auth";
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from "cookies-next";
import { Auth as AuthServer, DecodedIdToken } from "firebase-admin/auth";

export const signIn = ({ user }: UserCredential): User => {
  setCookies(
    process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string,
    user.getIdToken()
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
