import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { pusher_server } from "@/lib/pusher_server";

export async function POST(req) {
  let { uid, questionId, currentChoiceId, newChoiceId } = await req.json();

  newChoiceId = parseInt(newChoiceId);
  currentChoiceId = parseInt(currentChoiceId);

  if (currentChoiceId) {
    await prisma.user.update({
      where: {
        uid: uid,
      },
      data: {
        votes: {
          disconnect: [{ id: currentChoiceId }],
          connect: {
            id: newChoiceId,
          },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        uid: uid,
      },
      data: {
        votes: {
          connect: {
            id: newChoiceId,
          },
        },
      },
    });
  }

  // trigger pusher vote event
  await pusher_server.trigger(`${questionId}`, "update-stats", ""); // third argument is the data to be sent, seems like it is required even though i have none

  return new NextResponse();
}
