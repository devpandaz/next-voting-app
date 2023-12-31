"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingWebsite } from "@/app/loading";

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function createUserRecordIfNotExist(uid, displayName, profileImageUrl) {
    const body = {
      uid: uid,
      displayName: displayName,
      profileImageUrl: profileImageUrl,
    };
    try {
      const res = await fetch("/api/auth/add-user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());
      // console.log(res.user);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        createUserRecordIfNotExist(user.uid, user.displayName, user.photoURL);
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
