"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingWebsite } from "@/app/loading";

const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function createUserRecordIfNotExist(uid) {
    const body = { uid: uid };
    const res = await fetch(`${WEBSITE_BASE_URL}/api/auth/add-user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());
    console.log(res.user);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        createUserRecordIfNotExist(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <LoadingWebsite /> : children}
    </AuthContext.Provider>
  );
};
