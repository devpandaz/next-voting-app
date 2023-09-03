import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { pusher_server } from "@/lib/pusher_server";

export async function POST(req) {
  let { uid, questionId, currentChoiceId } = await req.json();
  await prisma.user.update({
    where: {
      uid: uid,
    },
    data: {
      votes: {
        disconnect: [{ id: currentChoiceId }],
      },
    },
  });
  // trigger pusher vote event
  pusher_server.trigger(`${questionId}`, "update stats", "");

  return new NextResponse();
}
