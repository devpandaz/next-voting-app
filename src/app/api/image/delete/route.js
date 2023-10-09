import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  let { url } = await req.json();

  await del(url);

  return new NextResponse();
}
