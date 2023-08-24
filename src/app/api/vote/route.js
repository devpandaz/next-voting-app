import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(req) {
  let { selected } = await req.json();
  selected = parseInt(selected);
  const choice = await prisma.choice.findUniqueOrThrow({
    where: {
      id: selected,
    },
  });
  const question = await prisma.choice.update({
    where: {
      id: selected,
    },
    data: {
      votes: choice.votes + 1,
    },
    select: {
      question: {
        include: {
          choices: {
            orderBy: {
              id: "asc",
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ question });
}
