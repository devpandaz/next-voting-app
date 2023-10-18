"use client";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "@/lib/signin";

export default function SignInPage({ searchParams }) {
  const redirect = searchParams.redirect ? searchParams.redirect : "/feed";

  const router = useRouter();
  const { toast } = useToast();

  async function handleSignIn(method) {
    const { result, error } = await signIn(method);
    if (error) {
      toast({
        title: "Error",
        description: "Sign in failed. ",
        variant: "destructive",
      });
    } else {
      // sign in success
      router.push(redirect);
    }
  }
  return (
    <div className="w-fit mt-2 mx-auto border-2 border-slate-950 dark:border-slate-50 rounded-lg p-2 flex flex-col">
      <Button
        className="m-3"
        onClick={() => {
          handleSignIn("google");
        }}
      >
        <LogIn className="mr-2 h-4 w-4" /> Sign In with Google
      </Button>
      <p className="text-sm">More sign in methods are coming soon.</p>
      {
        /*<Button
        className="m-3"
        onClick={() => {
          handleSignIn("github");
        }}
      >
        <Github className="mr-2 h-4 w-4" /> Sign In with Github
      </Button>*/
      }
    </div>
  );
}
