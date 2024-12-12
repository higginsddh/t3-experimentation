import Pusher from "pusher-js";
import { env } from "../env/client.mjs";

export const clientPusher = new Pusher(env.NEXT_PUBLIC_PUSHER_ID, {
  cluster: "us2",
});
