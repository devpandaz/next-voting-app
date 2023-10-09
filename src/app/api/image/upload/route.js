import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("questionId");

  const blob = await put(filename, req.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
