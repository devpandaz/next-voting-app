import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req, { params }) {
  let { questionId } = params;
  const { uid } = await req.json();
  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: questionId,
    },
    include: {
      choices: {
        orderBy: {
          id: "asc",
        },
      },
      user: {
        select: {
          uid: true,
          displayName: true,
        },
      },
    },
  });

  const currentChoiceId = (await prisma.choice.findMany({
    where: {
      questionId: questionId,

      users: {
        some: {
          uid: uid,
        },
      },
    },
    select: {
      id: true,
    },
  }))[0]?.id;

  // to get users count for every choices of this specific question
  const choicesWithUsersCount = await prisma.choice.findMany({
    select: {
      _count: {
        select: {
          users: true,
        },
      },
      id: true,
    },
    where: {
      questionId: questionId,
    },
    orderBy: {
      id: "asc",
    },
  });

  let totalVotes = 0;
  choicesWithUsersCount.forEach((choice) => {
    totalVotes += choice._count.users;
  });

  return NextResponse.json({
    question,
    currentChoiceId,
    choicesWithUsersCount,
    totalVotes,
  });
}
