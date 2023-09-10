import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  const { uid } = await req.json();
  const profile = await prisma.user.findUniqueOrThrow({
    where: {
      uid: uid,
    },
    include: {
      votes: true,
    },
  });

  return NextResponse.json({ profile });
}
