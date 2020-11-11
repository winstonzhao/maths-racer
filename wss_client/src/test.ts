import { WssClient } from "./client";

(async () => {
  const client = new WssClient("localhost", 8080);
  await client.waitForConnect();

  await client.register("Winston");

  await client.createGame();
})();
