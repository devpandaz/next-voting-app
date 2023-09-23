"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "./loading";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/feed");
      } else {
        router.push("/home");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  if (loading || !user) {
    return <LoadingWebsite />;
  }

  return <></>;
}
