import Profile from "@/components/Profile";

// user own private profile
// for public profile of other users, see /profile/[uid]/page.js

export default function Page() {
  return <Profile />;
}

export const metadata = {
  title: "Your profile",
};
