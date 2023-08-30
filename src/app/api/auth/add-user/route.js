import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  let { uid } = await req.json();
  const user = await prisma.user.upsert({
    where: {
      uid: uid,
    },
    create: {
      uid: uid,
    },
    update: {
      uid: uid,
    },
  });
  return NextResponse.json({ user });
}
