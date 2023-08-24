import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function GET(req, { params }) {
  const { questionId } = params;
  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: parseInt(questionId),
    },
    include: {
      choices: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  return NextResponse.json({ question });
}
