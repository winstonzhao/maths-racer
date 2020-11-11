import { CreateGameRequest, Response, ResponseType } from "../common/proto/wss";
import { HttpServer } from "../connectivity/HttpServer";
import { WebSocketServer } from "../connectivity/WebSocketSever";
import { GameManager } from "./GameManager";

export class GameServer {
  gameManager: GameManager = new GameManager();
  webSocketServer: WebSocketServer = new WebSocketServer(
    8080,
    this.gameManager
  );
  httpServer: HttpServer = new HttpServer();
}
