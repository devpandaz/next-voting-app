import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function GET() {
  const questions = await prisma.question.findMany({});

  return NextResponse.json({ questions });
}
