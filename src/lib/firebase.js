import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const app = initializeApp(
  JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG),
);

export const auth = getAuth();
