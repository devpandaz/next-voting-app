import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { uid, questionText, choices } = await req.json();
  choices = choices.map((choice) => ({ choiceText: choice }));
  const res = await prisma.question.create({
    data: {
      questionText: questionText,
      choices: {
        create: choices,
      },
      uid: uid,
    },
    select: {
      id: true,
    },
  });
  const createdQuestionId = res.id;
  await prisma.user.update({
    where: { uid: uid },
    data: {
      questions: {
        connect: {
          id: createdQuestionId,
        },
      },
    },
  });

  return NextResponse.json({ createdQuestionId });
}
