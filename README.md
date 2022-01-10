# Firebase auth with cookies

## Installation

```bash
npm i next-firebase-auth-cookies
```

## Configuration

Create a `.env.local` in your root project directory, this will be cookie name.

```js
// .env.local
NEXT_PUBLIC_COOKIE_NAME = "demo";
```

## Usage

create a page `demo`, `signin` function create a cookie with firebase data login.

```tsx
// /page/demo
import { app } from "../firebase.config.js"; // your firebase config
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { signIn } from "next-firebase-auth-cookies";

const auth = getAuth(app);

const Demo = () => {
  const handlerLogin = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(signIn)
      .catch((error) => console.log(error));
  };

  return <button onClick={handlerLogin}>login with google</button>;
};

export default Demo;
```

now create an endpoint `pages/api/auth/login` or `pages/api/auth/[...auth]`, this endpoint will return a cookie value.

```ts
// /pages/api/login
import { getAuthCookieApi } from "firebase-auth-with-cookies";

const login = (req, res) => {
  getAuthCookieApi({ req, res }, { user: null }); // third is optional
};

export default handler;
```

`getAuthCookieApi` and `getAuthCookieApi`, receive as three parameters: `error`, this parameter is the response of the endpoint when user is not `login`.

```json
{
  "message": "Unauthorized"; // this is the default response, when cookie not exist
}
```

but if user is logged, the response will be.

```ts
type User = { // this is value from cookie
  displayName: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string | null;
  providerData: UserInfo[];
  uid: string;
};
```

Now we need an observer to listen the `login` of the user, I recommend to use `useSWR` to listen the `signIn` adn `signOut` events.

```bash
npm i swr
```

```jsx
// /page/demo
import { app } from "../firebase.config.js"; // your firebase config
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import useSWR from "swr";

import { signIn, signOut } from "next-firebase-auth-cookies";

const auth = getAuth(app);
const fetcher = (args) => fetch(args).then((res) => res.json());

const Demo = () => {
  const { data, errorm mutate } = useSWR("/api/auth/login", fetcher);
  const handlerLogin = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(signIn)
      .catch((error) => console.log(error));
  };
  const hanlderLogout = () => {
    signOut(auth); // signOut remove the cookie
    mutate(); // mutation page, to update the data user
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <h1>
        {
          data.?uid ?
          `you're loged as ${data?.displayName}` :
          "you're not loged please loged"
        }
      </h1>
      <button onClick={handlerLogin}>
        login with google
      </button>
      <button onClick={hanlderLogout}>logout</button>
    </div>
  );
};

export default Demo;
```

if use typescript you can use `User` as `generics` for `useSWR`

```tsx
// /page/demo
import { User } from "firebase-auth-with-cookies";

const Demo = () => {
  const { data, error } = useSWR<User>("/api/auth/login", fetcher);
  ...
}
```

you too can use `getServerSideProps` with `getAuthCookieProps` to get the cookie value as props

```js
// /page/demo
export const getServerSideProps = ({ req, res }) => {
  const cookieValue = getAuthCookieProps({ req, res }, { // this data not required loaders, but no mutation data when user is logout or login
    user: "not logged or error uwu",
  }); // too resive the parameterm
  return {
    props: {
      cookieValue
    },
  };
};

export default Demo;
```

## Example

### view an example

- [github repository](https://github.com/hateVtubers/demo)
- [website](https://demo-jade-xi.vercel.app/)
