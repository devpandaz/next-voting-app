"use client";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Plus, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { useToast } from "./ui/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function Header() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { toast } = useToast();

  console.log(user);

  return (
    <div className="flex justify-center py-3 sticky top-0 bg-slate-200/25 dark:bg-gray-700/25 backdrop-blur-sm">
      <div className="flex items-center px-5">
        <Link
          className="text-lg md:text-2xl font-bold"
          href={user ? "/feed" : "/"}
        >
          Django Voting App
        </Link>
      </div>
      <div className="space-x-1 flex items-center">
        <ThemeToggle />
        {user &&
          (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="outline" size="icon">
                    <Link href="/newpoll">
                      <Plus className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New poll</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {!user
                ? (
                  <Button asChild variant="outline" size="icon">
                    <Link href="/auth/signin">
                      <LogIn className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                  </Button>
                )
                : (
                  <Button
                    variant="outline"
                    size="icon"
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
                    <LogOut className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{user ? "Sign out" : "Sign in"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {user &&
          (
            <>
              <Button asChild variant="outline" size="icon">
                <Link href="/profile">
                  <User className="h-[1.2rem] w-[1.2rem]" />
                </Link>
              </Button>
            </>
          )}
      </div>

      {
        /*<Image
        src={user.photoURL}
        width={20}
        height={20}
        alt="profile picture"
      />/*}
      {
        /*<SignedIn>
        <div className="flex items-center px-1">
          <UserButton
            afterSignOutUrl={`${WEBSITE_BASE_URL}/sign-in`}
            appearance={{
              elements: {
                userButtonPopoverCard: "bg-white dark:bg-black",
                userButtonPopoverActionButtonText: "text-black dark:text-white",
              },
            }}
          />
        </div>
      </SignedIn>*/
      }
    </div>
  );
}
