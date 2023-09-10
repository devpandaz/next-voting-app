"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";

export default function Profile() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function fetchProfile() {
    const body = { uid: user.uid };
    const res = await fetch("/api/profile/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());
    setProfile(res.profile);
  }

  useEffect(() => {
    if (!loading) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading || !user || !profile) {
    return <LoadingWebsite />;
  }

  console.log(profile.votes);

  return (
    <div className="w-fit mx-auto">
      <Card className="mb-2 border-2 rounded-xl border-slate-300 mx-4 w-80">
        <CardHeader>
          <CardTitle>{user.displayName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{profile.votes.length} votes</p>
        </CardContent>
      </Card>
    </div>
  );
}
