"use client";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { LogIn, Plus, User } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user } = useAuthContext();

  const pathname = usePathname();

  // console.log(user);

  return (
    <div className="flex justify-center py-3 top-0 bg-slate-200 dark:bg-slate-700">
      <div className="flex items-center px-5">
        <Link
          className="text-xl md:text-2xl font-bold"
          href="/feed"
        >
          Next Voting App
        </Link>
      </div>
      <div className="space-x-1 flex items-center">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button asChild variant="outline" size="icon">
                <Link
                  href={user ? "/newpoll" : "/auth/signin?redirect=/newpoll"}
                >
                  <Plus className="h-[1.2rem] w-[1.2rem]" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New poll</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button asChild variant="outline" size="icon">
          <Link href={user ? "/profile" : "/auth/signin?redirect=/profile"}>
            <User className="h-[1.2rem] w-[1.2rem]" />
          </Link>
        </Button>
        {!user &&
          (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="outline" size="icon">
                    <Link
                      href={`/auth/signin${
                        pathname === "/auth/signin"
                          ? ""
                          : `?redirect=${pathname}`
                      }`}
                    >
                      <LogIn className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
      </div>
    </div>
  );
}
