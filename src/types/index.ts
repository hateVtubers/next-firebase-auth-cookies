import { User as FirebaseUser } from 'firebase/auth';

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

export type UserState = {
  loading: boolean;
  user: null | undefined | User | FirebaseUser;
};
