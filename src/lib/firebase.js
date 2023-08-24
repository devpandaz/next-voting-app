import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const app = initializeApp({
  apiKey: "AIzaSyB6WgEHKlzYfuwr3ife6qwwc5Zz-voeGOE",
  authDomain: "django-voting-app-cb140.firebaseapp.com",
  databaseURL:
    "https://django-voting-app-cb140-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "django-voting-app-cb140",
  storageBucket: "django-voting-app-cb140.appspot.com",
  messagingSenderId: "668237897775",
  appId: "1:668237897775:web:52a11b171fd9db7bc066da",
  measurementId: "G-J6TBTFSZS6",
});

export const auth = getAuth();
