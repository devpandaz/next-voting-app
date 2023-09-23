"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "../loading";

export default function Home() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingWebsite />;
  }

  return (
    <div className="w-fit mx-auto">
      <div className="flex flex-col w-80 border-2 border-slate-950 dark:border-slate-50 rounded-xl p-4">
        <h1 className="text-lg font-bold mb-1">
          Next Voting App by{" "}
          <Link
            className="text-yellow-500 dark:text-red-300 hover:underline"
            href="https://github.com/devpandaz/next-voting-app"
          >
            devpandaz
          </Link>
        </h1>
        <h3 className="text-md underline">A brief history of this app</h3>
        <p className="text-md text-justify">
          This app is initially built in Django Python, then later migrated to a
          combination of NextJS as frontend and Django as backend, then now
          fully built in NextJS.
        </p>
        <Button asChild className="self-center mt-2">
          <Link href={user ? "/feed" : "/auth/signin"}>
            {user ? "Go to feed" : "Sign in"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
