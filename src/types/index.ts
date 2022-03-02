import { User } from 'firebase/auth';

export type UserServer = null | {
  displayName: string;
  email: string | null;
  emailVerified: boolean | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string;
  uid: string;
  providerData: {
    displayName: any;
    email: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    providerId: string;
    uid: string;
  }[];
};

export type UserClient = (UserServer & User) | null;

export type UserState = {
  loading: boolean;
  user: UserClient;
};
