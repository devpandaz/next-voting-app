import Pusher from "pusher";

const {
  NEXT_PUBLIC_PUSHER_APP_ID: appId,
  NEXT_PUBLIC_PUSHER_APP_KEY: key,
  NEXT_PUBLIC_PUSHER_SECRET: secret,
  NEXT_PUBLIC_PUSHER_CLUSTER: cluster,
} = process.env;

export const pusher_server = new Pusher({
  appId: appId,
  key: key,
  secret: secret,
  cluster: cluster,
  useTLS: true,
});
