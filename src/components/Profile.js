"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Loading, { LoadingWebsite } from "@/app/loading";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "./ui/use-toast";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserPolls, UserVotes } from "./UserStats";

export default function Profile({ uidForPublicProfile = null }) {
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
    const body = { uid: uidForPublicProfile ? uidForPublicProfile : user.uid };
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

  if (loading || !profile) {
    return <LoadingWebsite />;
  }

  return (
    <div className="w-fit mx-auto mt-2">
      <div className="flex flex-col w-80">
        <Card className="border-2 rounded-xl border-slate-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="grow">
                {profile.displayName}
                {" "}
              </span>
              <Image
                src={profile.profileImageUrl}
                width={40}
                height={40}
                alt="profile picture"
                className="rounded-full"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!uidForPublicProfile // no uidForPublicProfile prop, user own private profile
              ? <Tabs defaultValue="polls">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="polls">Polls</TabsTrigger>
                  <TabsTrigger value="votes">Votes</TabsTrigger>
                </TabsList>
                <TabsContent value="polls">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your polls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={Loading}>
                        <UserPolls uid={user.uid} />
                      </Suspense>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="votes">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your votes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UserVotes uid={user.uid} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              // got uidForPublicProfile prop, public profile
              : (
                <Card className="border-2 border-yellow-500 dark:border-red-300">
                  <CardHeader>
                    <CardTitle>Polls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={Loading}>
                      <UserPolls uid={uidForPublicProfile} />
                    </Suspense>
                  </CardContent>
                </Card>
              )}
          </CardContent>
          <CardFooter className="justify-center">
            {!uidForPublicProfile && // private profile
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
              </Button>}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
