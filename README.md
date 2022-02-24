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
NEXT_PUBLIC_FIREBASE_TOKEN = 'token';
```

## Requiered

We need firebase client and server auth

```js
// firebase client
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { signIn } from 'next-firebase-auth-cookies';

const firebaseConfig = {
  apiKey: 'your firebase config',
  authDomain: 'your firebase config',
  projectId: 'your firebase config',
  storageBucket: 'your firebase config',
  messagingSenderId: 'your firebase config',
  appId: 'your firebase config',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

```js
// firebase server
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import firebaseConfig from './firebaseConfigServer'; // this is json from firebase admin
import { getAuth } from 'firebase-admin/auth';

const app = getApps().length // why? because not need multiple apps
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
import { signIn, signOut } from 'next-firebase-auth-cookies/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const handleLogin = () => {
  signInWithPopup(auth, new GoogleAuthProvider()); // client
  then(signIn).catch(() => {});
};

export const handleLogOut = () => {
  signOut(auth); //auth from firebase client
};
```

cheack session on server with `userSessionState`
you can use `getServerSideProps` or custom api route

```js
import { userSessionState } from 'next-firebase-auth-cookies';

export const getServerSideProps = async ({ req, res }) => {
  const userSessionState = await userSessionState(auth, { req, res }); // auth from firebase admin

  return {
    props: {
      userSessionState: userSessionState ?? null,
    },
  };
};
```

or

```js
// api/auth/session
import { userSessionState } from 'next-firebase-auth-cookies';

const handler = async ({ req, res }) => {
  const { user, error } = await userSessionState(auth, { req, res }); // auth from firebase admin

  if (!user) {
    req.res.status(401).send(error);
  } else {
    req.res.status(200).send(user);
  }
};
```

## Get User without ssr

this user is valid only client side

```js
const { user, loading } = useAuth({ auth }); // firebase auth client
```

## Get User with ssr

this hook create a listener with user logIn or logOut
by default the value is `undefined` you can change this value

```jsx
import { getSessionUser } from 'next-firebase-auth-cookies';

const Home = ({ user }) => {
  const { user, loading } = useAuth({ auth, userSSR: user }); // when change default value loading is false
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

export const getServerSideProps = async ({ req, res }) => {
  const { user, error } = await userSessionState(auth, { req, res }); // auth from firebase admin

  return {
    props: {
      user,
    },
  };
};

export default Home;
```

## Typescript

User value in server

```ts
export type User = {
  user: null | {
    displayName: string;
    email?: string;
    emailVerified?: boolean;
    photoURL?: string;
    phoneNumber?: string;
    providerId: string;
    uid: string;
    providerData: {
      displayName: any;
      email?: string;
      photoURL?: string;
      phoneNumber?: string;
      providerId: string;
      uid: string;
    }[];
  };
  error: string | null;
};
```

User value in client

```ts
export type UserState = {
  loading: boolean;
  user: null | undefined | User | FirebaseUser;
};
```

import types
```ts
import type { UserState, User } from 'next-firebase-auth-cookies/types';
```

## Example

View an example

- [github repository](https://github.com/hateVtubers/demo)
- [website](https://demo-jade-xi.vercel.app/)
