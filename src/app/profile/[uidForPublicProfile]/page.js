import Profile from "@/components/Profile";
import prisma from "@/prisma/prisma";

// public profile for users

export default function Page({ params }) {
  const { uidForPublicProfile } = params;
  return <Profile uidForPublicProfile={uidForPublicProfile} />;
}

export async function generateMetadata({ params }) {
  const { uidForPublicProfile } = params;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: uidForPublicProfile,
    },
  });

  return {
    title: user.displayName,
  };
}

export async function generateStaticParams() {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    uidForPublicProfile: user.uid,
  }));
}
