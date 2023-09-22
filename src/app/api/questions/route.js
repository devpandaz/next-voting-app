import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST() {
  const questions = await prisma.question.findMany({});
  console.log("questions" + questions);

  return NextResponse.json({ questions });
}
