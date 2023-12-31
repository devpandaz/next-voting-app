import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { lastQuestionId, searchQuery } = await req.json();

  if (searchQuery !== "null") {
    const questions = await prisma.question.findMany({
      where: {
        questionText: {
          search: searchQuery,
        },
      },
    }); // search results
    return NextResponse.json({ questions });
  }
  const takeAmount = 30;
  let questions;
  let hasMore;

  // first take, no cursor yet
  if (!lastQuestionId) {
    questions = await prisma.question.findMany({
      take: takeAmount,
      orderBy: {
        timePublished: "desc",
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
        timePublished: "desc",
      },
    });
  }
  lastQuestionId = questions.at(-1).id;
  const lastRecordInTable = await prisma.question.findFirst({
    orderBy: {
      timePublished: "asc",
    },
    select: {
      id: true,
    },
  });
  hasMore = lastQuestionId !== lastRecordInTable.id;
  return NextResponse.json({ lastQuestionId, questions, hasMore });
}
