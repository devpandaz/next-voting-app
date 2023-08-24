"use client";
import { Github, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "@/lib/signin";

export default async function SignInPage() {
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
      console.log(result.user);
      router.push("/feed");
    }
  }
  return (
    <div className="w-fit mx-auto border-2 border-slate-950 dark:border-slate-50 rounded-lg p-4">
      <div className="m-3">
        <Button
          onClick={() => {
            handleSignIn("google");
          }}
        >
          <LogIn className="mr-2 h-4 w-4" /> Sign In with Google
        </Button>
      </div>
      <div className="m-3">
        <Button
          onClick={() => {
            handleSignIn("github");
          }}
        >
          <Github className="mr-2 h-4 w-4" /> Sign In with Github
        </Button>
      </div>
    </div>
  );
}
