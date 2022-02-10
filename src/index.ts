import {
  Auth,
  signOut as logout,
  User,
  UserCredential,
} from "firebase/auth";
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from "cookies-next";
import { Auth as AuthServer, DecodedIdToken } from "firebase-admin/auth";

const token = process.env.NEXT_PUBLIC_FOREBASE_TOKEN as string;

export const signIn = ({ user }: UserCredential): User => {
  setCookies(token, user.getIdToken());
  return user;
};

export const signOut = (auth: Auth): void => {
  logout(auth);
  removeCookies(token);
};

export const getSessionUser = async (
  auth: AuthServer,
  { req, res }: { req: any; res: any }
): Promise<DecodedIdToken | null | undefined> => {
  if (!checkCookies(token, { req, res })) return;

  const cookie = getCookie(token, { req, res }) as string;

  const user = await auth
    .verifyIdToken(cookie)
    .then((value) => value)
    .catch(() => null);

  return user;
};
