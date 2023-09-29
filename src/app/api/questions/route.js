import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { lastQuestionId } = await req.json();
  const takeAmount = 15;
  let questions;
  let hasMore;

  // first take, no cursor yet
  if (!lastQuestionId) {
    questions = await prisma.question.findMany({
      take: takeAmount,
      orderBy: {
        datePublished: "desc",
      },
    });

    if (questions.length == 0) {
      return NextResponse.json({ questions });
    }

    // consequent fetch, got lastQuestionId already
  } else {
    questions = await prisma.question.findMany({
      take: takeAmount,
      skip: 1,
      cursor: {
        id: lastQuestionId,
      },
      orderBy: {
        datePublished: "desc",
      },
    });
  }
  lastQuestionId = questions.at(-1).id;
  const lastRecordInTable = await prisma.question.findFirst({
    orderBy: {
      datePublished: "asc",
    },
    select: {
      id: true,
    },
  });
  hasMore = lastQuestionId !== lastRecordInTable.id;
  return NextResponse.json({ lastQuestionId, questions, hasMore });
}
