import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  let { uid, questionText, choices, toBeEditedQuestionId } = await req.json();
  choices = choices.map((choice) => ({ choiceText: choice }));

  let createdOrEditedQuestionId;

  await prisma.$transaction(async (tx) => {
    // delete all old choices of the question if editing
    if (toBeEditedQuestionId) {
      await tx.choice.deleteMany({
        where: {
          questionId: toBeEditedQuestionId,
        },
      });
    }

    const createdOrEditedQuestion = await tx.question.upsert({
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
    createdOrEditedQuestionId = createdOrEditedQuestion.id;
    await tx.user.update({
      where: { uid: uid },
      data: {
        questions: {
          connect: {
            id: createdOrEditedQuestionId,
          },
        },
      },
    });
  });

  return NextResponse.json({ createdOrEditedQuestionId });
}
