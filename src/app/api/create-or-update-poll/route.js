import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let {
    uid,
    questionId,
    questionText,
    pollImageURL,
    choices,
    removedExistingChoicesIDs,
    editing,
  } = await req.json();
  // note: from PollEditor.js: questionId = toBeEditedQuestionId ? toBeEditedQuestionId : uuidv4()

  // note: choices[] consists of choice object:
  // {id (present for existing ones; absent for newly created ones): __,
  // choiceText: __}
  let newChoices;
  if (!editing) {
    newChoices = choices.map((choice) => (
      {
        choiceText: choice.choiceText,
      }
    ));
  }

  await prisma.$transaction(async (tx) => {
    await tx.question.upsert({
      where: {
        id: questionId,
      },
      create: {
        id: questionId,
        questionText: questionText,
        imageURL: pollImageURL,
        choices: {
          create: newChoices,
        },
        uid: uid,
      },
      update: {
        questionText: questionText,
        imageURL: pollImageURL,
        // update questionText and pollImageURL is enough, choices will be updated below
      },
    });

    if (editing) { // rmb, editing can edit existing choice text or add new choice, or reorder the choices
      // first, to prepare for choices reordering, we disconnect all choices from the question first
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          choices: {
            set: [],
          },
        },
      });

      for (const choice of choices) {
        if (choice.id) { // got choice id, means existing ones
          await prisma.choice.update({
            where: {
              id: choice.id,
            },
            data: {
              choiceText: choice.choiceText,
              question: {
                connect: {
                  id: questionId,
                },
              },
            },
          });
        } else { // no choice id, means newly added one
          await prisma.choice.create({
            data: {
              choiceText: choice.choiceText,
              question: {
                connect: {
                  id: questionId,
                },
              },
            },
          });
        }
      }

      // delete all removed existing choices if any
      await prisma.choice.deleteMany({
        where: {
          id: {
            in: removedExistingChoicesIDs,
          },
        },
      });
    }

    if (!editing) { // connect newly created question to users record
      await tx.user.update({
        where: { uid: uid },
        data: {
          questions: {
            connect: {
              id: questionId,
            },
          },
        },
      });
    }
  });

  return new NextResponse();
}
