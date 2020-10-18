import WebSocket, { Server } from "ws";
import { JoinMesasge, Type, WssMessage } from "../types/wss";

export class WebSocketServer {
  server: Server;
  idCounter = 0;
  connections: { [id: number]: WebSocket } = {};

  constructor(port: number) {
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
      conn.addListener("message", (data) =>
        this.routeMessage(this.idCounter, conn, data)
      );
    });
  }

  handleJoin(id: number, conn: WebSocket, msg: JoinMesasge) {}

  routeMessage(id: number, conn: WebSocket, data: WebSocket.Data) {
    try {
      const message: WssMessage = JSON.parse(data as string);
      if (!message.type) {
        // LOG
        return;
      }

      switch (message.type) {
        case Type.JOIN:
          this.handleJoin(id, conn, message as JoinMesasge);
          break;
      }

      // LOG
      return;
    } catch {
      // LOG
    }
  }
}
