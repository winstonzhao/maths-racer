import { describe, expect, test } from "@jest/globals";
import { Game } from "../src/lib/game_sever/Game";
import { GameManager } from "../src/lib/game_sever/GameManager";
import { ResponseType } from "../src/lib/game_sever/Types";

test("test start game", () => {
  const gameManager = new GameManager();
  let pResp = gameManager.addPlayer("Winston");
  expect(pResp.type === ResponseType.SUCCESS);
  expect(pResp.info.name === "Winston");

  const winston = pResp.info;

  pResp = gameManager.addPlayer("Teresa");
  expect(pResp.type === ResponseType.SUCCESS);
  expect(pResp.info.name === "Teresa");

  const teresa = pResp.info;

  let gResp = gameManager.createGame(winston.id);
  expect(gResp.type == ResponseType.SUCCESS);
  const game = gResp.info as Game;
  expect(game.getPlayerCount() === 1);
  expect(game.playersMap[winston.id]);

  let jResp = gameManager.joinGame(teresa.id, game.id);
  expect(jResp.type == ResponseType.SUCCESS);
  expect(game.getPlayerCount() === 2);

  expect(game.questions.length === game.NUM_QUESTIONS);
});
