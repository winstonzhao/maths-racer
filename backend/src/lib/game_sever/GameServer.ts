import { User } from "../common/model/user";
import { HttpServer } from "../connectivity/HttpServer";
import { WebSocketServer } from "../connectivity/WebSocketSever";
import { GameManager } from "./GameManager";

export class GameServer {
  gameManager: GameManager = new GameManager();
  webSocketServer: WebSocketServer = new WebSocketServer(8080, this);
  httpServer: HttpServer = new HttpServer();

  register(username: string) {
    const resp = this.gameManager.addPlayer(username);

    if (!resp.info) {
      return;
    }

    return resp.info.id;
  }
}
