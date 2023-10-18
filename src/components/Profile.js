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
import Loading, { LoadingWebsite } from "@/app/loading";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "./ui/use-toast";
import { Link, LogOut } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserPolls, UserVotes } from "./UserStats";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useAuthContext } from "@/context/AuthContext";

export default function Profile({ uidForPublicProfile = null }) {
  const router = useRouter();
  const [profile, setProfile] = useState();
  const { toast } = useToast();

  const { user, loading } = useAuthContext();

  async function fetchProfile() {
    let body;
    if (user) {
      body = { uid: uidForPublicProfile ? uidForPublicProfile : user.uid };
    } else {
      if (uidForPublicProfile) {
        body = { uid: uidForPublicProfile };
      } else {
        router.push("/feed");
        return;
      }
    }
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
      <div className="flex flex-col w-80 md:w-[500px]">
        <Card className="border-2 rounded-xl border-slate-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="grow">
                <span>
                  {profile.displayName}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        className="ml-2"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${
                              process.env.NEXT_PUBLIC_DEV
                                ? "http://localhost:3000"
                                : "https://devpandaz-next-voting-app.vercel.app"
                            }/profile/${user ? user.uid : uidForPublicProfile}`,
                          );
                          toast({
                            title: "Profile link copied to clipboard. ",
                            duration: 2000,
                          });
                        }}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-normal tracking-normal">
                        Copy profile link
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
            {(!uidForPublicProfile || uidForPublicProfile === user?.uid) // no uidForPublicProfile prop, or even if got but its same as own uid then its -> user own private profile
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
                        <UserPolls uid={user?.uid} />
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
                      <UserVotes uid={user?.uid} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              // got uidForPublicProfile prop, public profile
              : (
                <Card>
                  <CardHeader>
                    <CardTitle>Polls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserPolls uid={uidForPublicProfile} />
                  </CardContent>
                </Card>
              )}
          </CardContent>
          <CardFooter className="justify-center">
            {(!uidForPublicProfile || uidForPublicProfile === user?.uid) && // no uidForPublicProfile prop, or even if got but its same as own uid then its -> user own private profile
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
