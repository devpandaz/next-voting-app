import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { questionId } = await req.json();

  await prisma.question.delete({
    where: {
      id: questionId,
    },
  });

  return new NextResponse();
}
