import { WssClient } from "./client";

(async () => {
  const client = new WssClient("localhost", 8080);
  await client.waitForConnect();

  client.register("Winston");
})();
