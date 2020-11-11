import WebSocket, { Server } from "ws";
import { Logger } from "../common/logger/logger";
import {
  CreateGameRequest,
  CreateGameResponse,
  RegisterRequest,
  RegisterResponse,
  Type,
  WssMessage,
} from "../common/proto/wss";
import { GameManager } from "../game_sever/GameManager";
import { GameServer } from "../game_sever/GameServer";

const logger = Logger.create("WSS");

export class WebSocketServer {
  server: Server;
  idCounter = 0;
  connections: { [id: number]: WebSocket } = {};
  connToUserId: { [connId: number]: number } = {};

  constructor(port: number, private gameServer: GameManager) {
    console.log(`Listening on port: ${port}`);
    this.server = new Server({
      port,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024, // Size (in bytes) below which messages
        // should not be compressed.
      },
    });

    this.server.addListener("connection", (conn) => {
      this.connections[++this.idCounter] = conn;
      logger.log(`New Connection with ID: ${this.idCounter}`);
      conn.addListener("message", (data) =>
        this.routeMessage(this.idCounter, conn, data)
      );
    });
  }

  handleRegister(id: number, conn: WebSocket, message: RegisterRequest) {
    const resp = this.gameServer.addPlayer(message.username);
    const userId = resp.info?.id;
    conn.send(JSON.stringify(new RegisterResponse(resp.type, message.tag)));

    if (!userId) {
      logger.log(
        `Unknown error while registering for connection id=${id}, registerMsg=${JSON.stringify(
          message
        )}`
      );
      return;
    }

    this.connToUserId[id] = userId;
    logger.log(
      `Handled register for connection=${id} user=${userId} username=${message.username}`
    );
  }

  handleCreateGame(id: number, conn: WebSocket, req: CreateGameRequest) {
    const resp = this.gameServer.createGame(id);
    conn.send(
      JSON.stringify(new CreateGameResponse(resp.type, req.tag, resp.info?.id))
    );
  }

  routeMessage(id: number, conn: WebSocket, data: WebSocket.Data) {
    try {
      const message: WssMessage = JSON.parse(data as string);
      if (!message.type) {
        logger.log(`Parsed message contains no type: ${message}`, "Warning");
        return;
      }

      switch (message.type) {
        case Type.REGISTER:
          this.handleRegister(id, conn, message as RegisterRequest);
          return;
        case Type.JOIN:
          // this.handleJoin(id, conn, message as JoinMesasge);
          return;
        case Type.CREATE_GAME:
          this.handleCreateGame(id, conn, message as CreateGameRequest);
          return;
      }

      logger.log(`Unknown message type: ${message.type}`, "Warning");
      return;
    } catch {
      logger.log(`Unable to parse message: ${data}`, "Warning");
    }
  }
}
