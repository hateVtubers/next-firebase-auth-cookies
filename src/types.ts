import type {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

export type Provider =
  | GithubAuthProvider
  | GoogleAuthProvider
  | FacebookAuthProvider
  | TwitterAuthProvider;
