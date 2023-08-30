import Pusher from "pusher";

export const pusher_server = new Pusher({
  appId: "1659334",
  key: "0c9d60ac45325717e4b7",
  secret: "c9931d2c78dcb868e6e4",
  cluster: "ap1",
  useTLS: true,
});
