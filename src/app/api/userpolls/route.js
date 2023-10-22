import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { uid } = await req.json();
  const questions = await prisma.question.findMany({
    where: {
      uid: uid,
    },
    orderBy: {
      timePublished: "desc",
    },
  });

  return NextResponse.json({ questions });
}
