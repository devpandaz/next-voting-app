import { pusher_server } from "@/lib/pusher_server";
import { NextResponse } from "next/server";

export async function POST(req) {
  let { data } = await req.json();
  pusher_server.trigger("channel", "event", {
    message: data,
  });

  return NextResponse("success");
}
