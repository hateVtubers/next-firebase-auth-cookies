import { removeCookies, setCookies } from 'cookies-next';
import { Auth, signOut as logOut, UserCredential } from 'firebase/auth';

const tokenName = process.env.NEXT_PUBLIC_FIREBASE_TOKEN as string;

export const signIn = async ({ user }: UserCredential) => {
  setCookies(tokenName, await user.getIdToken());
  return user;
};

export const signOut = async (auth: Auth) => {
  await logOut(auth);
  removeCookies(tokenName);
};
