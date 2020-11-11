import WebSocket from "ws";
import { Logger } from "./common/logger/logger";
import {
  Type,
  WssMessage,
  RegisterResponse,
  Codes,
  RegisterRequest,
} from "./common/proto/wss";

const logger = Logger.create("WS_CLIENT");

export class WssClient {
  ws: WebSocket;
  reqsInFlight: { [id: number]: any } = {};
  reqIdCounter = 0;
  connected = false;

  constructor(host: string, port: number) {
    this.ws = new WebSocket(`ws://${host}:${port}`);

    this.ws.on("open", () => {
      logger.log("Connected to server.");
      this.connected = true;
      if (0 in Object.keys(this.reqsInFlight)) {
        this.reqsInFlight[0]();
      }
    });

    this.ws.on("close", () => {
      logger.log("Disconnected from server.");
    });

    this.ws.on("message", (data) => {
      logger.log(`Got data: ${data}`);
    });
  }

  waitForConnect() {
    if (this.connected) {
      return;
    }

    return new Promise<void>((res) => {
      this.reqsInFlight[0] = res;
    });
  }

  handleMessage(data: WebSocket.Data) {
    try {
      const message: WssMessage = JSON.parse(data as string);
      if (!message.type) {
        logger.log(`Parsed message contains no type: ${message}`, "Warning");
        return;
      }

      switch (message.type) {
        case Type.REGISTER_RESPONSE:
          if (((message as any) as RegisterResponse).code === Codes.OK) {
            logger.log("Register OK!");
          }
          break;
      }

      logger.log(`Unknown message type: ${message.type}`, "Warning");
      return;
    } catch {
      logger.log(`Unable to parse message: ${data}`, "Warning");
    }
  }

  register(username: string) {
    const msg: RegisterRequest = { type: Type.REGISTER, username };
    this.ws.send(JSON.stringify(msg));
  }
}
