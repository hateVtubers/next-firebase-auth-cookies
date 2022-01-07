# Firebase auth with cookies

## Installation

```bash
npm i firebase-auth-with-cookies
```

## Configuration

Create a `.env.local` in your root project directory, this will be cookie name.

```js
// .env.local
NEXT_PUBLIC_COOKIE_NAME="demo"
```

## Usage

create a page `demo`.

```tsx
// /page/demo
import { loginWith, logout } from "firebase-auth-with-cookies";

const Demo = () => {
  return (
    <div>
      <button onClick={() => loginWith(auth, new GoogleAuthProvider())}>
        login with google
      </button>
      <button onClick={() => logout(auth)}>logout</button>
    </div>
  );
};

export default Demo;
```

now create a endpoint `pages/api/auth/login` or `pages/api/auth/[...auth]`, this endpoint will return a cookie value.
```ts
// /pages/api/login
import { getAuthCookieApi } from "firebase-auth-with-cookies";

const login = (req, res) => {
  getAuthCookieApi(req, res, { user: null }); // third is optional
}

export default handler
```

`getAuthCookieApi` receive as three parameters: `error`, this parameter is the response of the endpoint when user is not `login`.
```ts
{ message: "Unauthorized" }; // this is the default response, when user not logged
```
but if user is logged, the response will be.
```ts
type User = { // this is when user is logged
  displayName: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string | null;
  providerData: UserInfo[];
  uid: string;
};
```

Now we need a observer to listen the `login` of the user, I recommend to use `useSWR` to listen the `login` event.
```bash
npm i swr
```

```jsx
// /page/demo
import { loginWith, logout } from "firebase-auth-with-cookies";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Demo = () => {
  const { data, error } = useSWR("/api/auth/login", fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div>
      <h1>{data ? "you're not loged please loged" : `you're loged as ${data?.displayName}`}</h1>
      <button onClick={() => loginWith(auth, new GoogleAuthProvider())}>
        login with google
      </button>
      <button onClick={() => logout(auth)}>logout</button>
    </div>
  );
};

export default Demo;
```
if use typescript you can use `User` as `data` type
```tsx
// /page/demo
/* import type { User } from "firebase-auth-with-cookies";*/
import { loginWith, logout, User } from "firebase-auth-with-cookies";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Demo = () => {
  const { data, error } = useSWR<User>("/api/auth/login", fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div>
      <h1>{data ? "you're not loged please loged" : `you're loged as ${data?.displayName}`}</h1>
      <button onClick={() => loginWith(auth, new GoogleAuthProvider())}>
        login with google
      </button>
      <button onClick={() => logout(auth)}>logout</button>
    </div>
  );
};

export default Demo;
```

you too can use `getServerSideProps` with `getAuthCookieProps` to get the cookie value as props
```js
// /page/demo
import { loginWith, logout, getAuthCookieProps } from "firebase-auth-with-cookies";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Demo = ({ cookie }) => {
  const { data, error } = useSWR("/api/auth/login", fetcher)

  return (
    <div>
      <h1>{data ?? cookie?.displayName ? "you're not loged please loged" : `you're loged as ${data?.displayName}`}</h1>
      <button onClick={() => loginWith(auth, new GoogleAuthProvider())}>
        login with google
      </button>
      <button onClick={() => logout(auth)}>logout</button>
    </div>
  );
};

export const getServerSideProps = ({ req, res }) => {
  const cookie = getAuthCookieProps(req, res, { user: "not logged or error uwu" }); // too resive the parameterm, with user not logged
  return {
    props: {
      cookie 
    }
  };
}

export default Demo;
```

an example in progress...