"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "./ui/use-toast";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [profile, setProfile] = useState();
  const { toast } = useToast();

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
      <div className="flex flex-col">
        <Card className="mb-2 border-2 rounded-xl border-slate-300 mx-4">
          <CardHeader>
            <CardTitle className="flex">
              <span className="self-center grow">{user.displayName}{" "}</span>
              <Image
                src={user.photoURL}
                width={40}
                height={40}
                alt="profile picture"
                className="rounded-full"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{profile.votes.length} votes</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              onClick={() => {
                signOut(auth).then(() => {
                  router.push("/auth/signin");
                }).catch((err) => {
                  toast({
                    title: "Sign out failed",
                    description: err.message,
                    variant: "destructive",
                  });
                });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
