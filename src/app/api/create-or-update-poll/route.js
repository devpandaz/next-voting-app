import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  let { uid, questionText, choices, toBeEditedQuestionId } = await req.json();
  choices = choices.map((choice) => ({ choiceText: choice }));

  // delete all old choices of the question if editing
  if (toBeEditedQuestionId) {
    await prisma.choice.deleteMany({
      where: {
        questionId: toBeEditedQuestionId,
      },
    });
  }

  const createdOrEditedQuestion = await prisma.question.upsert({
    where: {
      id: toBeEditedQuestionId ? toBeEditedQuestionId : uuidv4(),
    },
    create: {
      id: uuidv4(),
      questionText: questionText,
      choices: {
        create: choices,
      },
      uid: uid,
    },
    update: {
      questionText: questionText,
      choices: {
        create: choices,
      },
    },
    select: {
      id: true,
    },
  });
  const createdOrEditedQuestionId = createdOrEditedQuestion.id;
  await prisma.user.update({
    where: { uid: uid },
    data: {
      questions: {
        connect: {
          id: createdOrEditedQuestionId,
        },
      },
    },
  });

  return NextResponse.json({ createdOrEditedQuestionId });
}
