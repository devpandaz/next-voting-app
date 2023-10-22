import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { uid } = await req.json();
  const votes = (await prisma.user.findUniqueOrThrow({
    where: {
      uid: uid,
    },
    select: {
      votes: {
        select: {
          id: true,
          choiceText: true,
          question: {
            select: {
              id: true,
              questionText: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  })).votes;

  return NextResponse.json({ votes });
}
