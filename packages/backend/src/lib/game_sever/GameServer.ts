import { HttpServer } from "../connectivity/HttpServer";
import { WebSocketServer } from "../connectivity/WebSocketSever";

export class GameServer {
  constructor() {
    this.webSocketServer = new WebSocketServer(8080);
    this.httpServer = new HttpServer();
  }

  webSocketServer: WebSocketServer;
  httpServer: HttpServer;
}
