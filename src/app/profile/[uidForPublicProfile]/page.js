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
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  return {
    title: user.displayName,
    openGraph: {
      title: `Next Voting App by devpandaz - ${user.displayName}'s profile`,
      description: `${user.displayName} has ${user._count.questions} poll${
        user._count.questions > 1 ? "s" : ""
      } available. Come vote for them now.`,
      images: [{
        url: user.profileImageUrl,
      }],
    },
  };
}
