import {
  Auth,
  signOut as logout,
  UserCredential,
  UserInfo,
} from "firebase/auth";
import {
  setCookies,
  removeCookies,
  checkCookies,
  getCookie,
} from "cookies-next";

export type User = {
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string | null;
  providerData: UserInfo[];
  uid: string;
};

export const signIn = ({
  user: {
    displayName,
    emailVerified,
    isAnonymous,
    photoURL,
    providerData,
    uid,
  },
}: UserCredential): void => {
  setCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string, {
    displayName,
    emailVerified,
    isAnonymous,
    photoURL,
    providerData,
    uid,
  });
};

export const signOut = (auth: Auth): void => {
  logout(auth);
  removeCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
};

export const getAuthCookieApi = (
  { req, res }: { req: any; res: any },
  apiResponse?: object
) => {
  if (
    checkCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res })
  ) {
    res
      .status(200)
      .json(
        getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res })
      );
  } else {
    res.status(200).json(apiResponse ?? { message: "Unauthorized" });
  }
};

export const getAuthCookieProps = (
  { req, res }: { req: any; res: any },
  apiResponse?: object
) => {
  if (
    checkCookies(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { req, res })
  ) {
    return JSON.parse(
      getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, {
        req,
        res,
      }) as string
    );
  } else {
    return apiResponse ?? { message: "Unauthorized" };
  }
};
