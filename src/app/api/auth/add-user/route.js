import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  let { uid, displayName, profileImageUrl } = await req.json();
  const user = await prisma.user.upsert({
    where: {
      uid: uid,
    },
    create: {
      uid: uid,
      displayName: displayName,
      profileImageUrl: profileImageUrl,
    },
    update: {
      uid: uid,
      displayName: displayName,
      profileImageUrl: profileImageUrl,
    },
  });
  return NextResponse.json({ user });
}
