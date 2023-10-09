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
import {
  NotificationBell,
  PopoverNotificationCenter,
} from "@novu/notification-center";

export default function Header() {
  const { user } = useAuthContext();

  // console.log(user);

  return (
    <div className="flex justify-center py-3 sticky top-0 bg-slate-200/25 dark:bg-gray-700/25 backdrop-blur-sm">
      <div className="flex items-center px-5">
        <Link
          className="text-xl md:text-2xl font-bold"
          href={user ? "/feed" : "/"}
        >
          Next Voting App
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

        {!user &&
          (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button asChild variant="outline" size="icon">
                    <Link href="/auth/signin">
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
        {user &&
          (
            <Button asChild variant="outline" size="icon">
              <Link href="/profile">
                <User className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button>
          )}
        {user &&
          (
            <PopoverNotificationCenter colorScheme={"light"}>
              {({ unseenCount }) => (
                <NotificationBell
                  unseenCount={unseenCount}
                />
              )}
            </PopoverNotificationCenter>
          )}
      </div>
    </div>
  );
}
