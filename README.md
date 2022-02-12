# Firebase auth with cookies

## Install

```bash
npm i next-firebase-auth-cookies@latest

npm i next-firebase-auth-cookies@latest firebase firebase-admin
```

## Configuration

Create a `.env.local` in your root project directory, this will be cookie name.

```ts
// .env.local
NEXT_PUBLIC_FIREBASE_TOKEN = "token";
```

## Requiered

We need firebase client and server auth

```js
// firebase client
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signIn } from "next-firebase-auth-cookies";

const firebaseConfig = {
  apiKey: "your firebase config",
  authDomain: "your firebase config",
  projectId: "your firebase config",
  storageBucket: "your firebase config",
  messagingSenderId: "your firebase config",
  appId: "your firebase config",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

```js
// firebase server
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { firebaseConfig } from "auth/firebase"; // this is json from firebase admin
import { getAuth } from "firebase-admin/auth";

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(firebaseConfig), // firebase admin json
    });

export const auth = getAuth(app);
```

## Usage

`signIn` create a cookie with tokenId and `signOut` remove cookie

```js
// auth is getAuth(app) from client
import { signIn, signOut } from "next-firebase-auth-cookies";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const handleLogin = () => {
  signInWithPopup(auth, new GoogleAuthProvider()); // client
  then(signIn).catch(() => {});
};

export const handleLogOut = () => {
  signOut(auth); // client
};
```

cheack session on server with `getSessionUser`

```js
import { getSessionUser } from "next-firebase-auth-cookies";

export const getServerSideProps = async ({ req, res }) => {
  const userSessionState = await getSessionUser(auth, { req, res }); // auth from firebase admin

  return {
    props: {
      userSessionState: userSessionState ?? null,
    },
  };
};
```

Why optional chaining? `getSessionUser` returns

- when cookie does not exist return `undefined`
- when cookie exist but is incorret return `null`
- when cookie exist and is corrext return `DecodedIdToken` firebease admin user

## Get User without ssr

```js
const { user } = useAuth({ auth }); // auth client
```

this hook create a listener with user logIn or logOut

- first value is `undefined` you change this value
- user not logged `null`
- user is logged `User` firebase client

you change the default value from hook

```tsx
import type { GetServerSideProps, NextPage } from "next";
import { getSessionUser } from "next-firebase-auth-cookies";

type Props = {
  userSessionState: DecodedIdToken | null;
};

const Home: NextPage<Props> = ({ userSessionState }) => {
  const { user } = useAuth({ auth, userSSR: userSessionState });
  return (
    <div>
      {user?.uid ? (
        <h1>{"Hi you're loged"}</h1>
      ) : (
        <h1>{"Hi you're not loged"}</h1>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSessionState = await getSessionUser(auth, { req, res }); // auth from firebase admin

  return {
    props: {
      userSessionState: userSessionState ?? null,
    },
  };
};

export default Home;
```

## Example

View an example

- [github repository](https://github.com/hateVtubers/demo)
- [website](https://demo-jade-xi.vercel.app/)
