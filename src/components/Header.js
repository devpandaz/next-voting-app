import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";

const WEBSITE_BASE_URL = process.env.WEBSITE_BASE_URL;

export default function Header() {
  return (
    <div className="flex justify-center py-3 sticky top-0 bg-slate-200 dark:bg-gray-700 mb-5">
      <div className="flex items-center px-5">
        <Link className="text-2xl font-bold" href="/">Django Voting App</Link>
      </div>
      <div className="flex items-center px-1">
        <ThemeToggle />
      </div>
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
      <hr />
    </div>
  );
}
