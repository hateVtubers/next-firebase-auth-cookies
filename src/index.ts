import type { Provider } from "./types";
import { Auth, signOut, UserInfo } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from "cookies-next";

export type User = {
  displayName: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string | null;
  providerData: UserInfo[];
  uid: string;
};

export const loginWith = (auth: Auth, provider: Provider): void => {
  signInWithPopup(auth, provider)
    .then(({ user: { displayName, emailVerified, isAnonymous, photoURL, providerData, uid }}) => {
        setCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string, {
          displayName,
          emailVerified,
          isAnonymous,
          photoURL,
          providerData,
          uid,
        });
      }
    )
    .catch(() => {});
};

export const logout = (auth: Auth): void => {
  signOut(auth);
  removeCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
};

export const getAuthCookieApi = (req: any, res: any, error?: object) => {
  if (checkCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res })) {
    res.status(200).json(getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res }));
  } else {
    res.status(200).json(error ?? { message: "Unauthorized" });
  } 
};

export const getAuthCookieProps = (req: any, res: any, error?: object) => {
  if (checkCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res })) {
    return JSON.parse(getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res }) as string);
  } else {
    return error ?? { message: "Unauthorized" };
  }
}
