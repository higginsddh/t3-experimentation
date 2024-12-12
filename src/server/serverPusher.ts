import Pusher from "pusher";
import { env } from "../env/server.mjs";

export const serverPusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});
