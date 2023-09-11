import Pusher from "pusher-js";

export const pusher_client = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  },
);

if (process.env.NEXT_PUBLIC_DEV) {
  Pusher.logToConsole = true;
}
