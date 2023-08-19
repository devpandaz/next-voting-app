import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET(req, { params }) {
  const { questionId } = params;
  const questions = await prisma.question.findUniqueOrThrow({
    where: {
      id: parseInt(questionId),
    },
  });

  return NextResponse.json({ questions });
}
