import WebSocket from "ws";
import { Logger } from "./common/logger/logger";
import {
  Type,
  RegisterResponse,
  RegisterRequest,
  CreateGameRequest,
  CreateGameResponse,
  ResponseType,
  GenericResponse,
  Response,
} from "./common/proto/wss";

const logger = Logger.create("WS_CLIENT");

export class WssClient {
  ws: WebSocket;
  reqsInFlight: {
    [id: number]: { res: (arg?: any) => void; rej: (arg?: any) => void };
  } = {};
  reqIdCounter = 0;
  connected = false;

  constructor(host: string, port: number) {
    this.ws = new WebSocket(`ws://${host}:${port}`);

    this.ws.on("open", () => {
      logger.log("Connected to server.");
      this.connected = true;
      if (0 in Object.keys(this.reqsInFlight)) {
        this.reqsInFlight[0].res();
      }
    });

    this.ws.on("close", () => {
      logger.log("Disconnected from server.");
    });

    this.ws.on("message", (data) => {
      logger.log(`Got data: ${data}`);
      this.handleMessage(data);
    });
  }

  waitForConnect() {
    if (this.connected) {
      return;
    }

    return new Promise<void>((res, rej) => {
      this.reqsInFlight[0] = { res, rej };
    });
  }

  handleMessage(data: WebSocket.Data) {
    try {
      const message: GenericResponse = JSON.parse(data as string);
      if (!message.type) {
        logger.log(`Parsed message contains no type: ${message}`, "Warning");
        return;
      }

      if (!this.reqsInFlight[message.tag]) {
        logger.log(`Cannot find in-flight request for tag: ${message.tag}`);
        return;
      }

      const { res, rej } = this.reqsInFlight[message.tag];

      if (message.code === ResponseType.SUCCESS) {
        res(ResponseType.SUCCESS);
      } else {
        rej(message.code);
      }

      switch (message.type) {
        case Type.REGISTER_RESPONSE:
          if (message.code === ResponseType.SUCCESS) {
            logger.log("Register OK!");
          }
          break;
        case Type.CREATE_GAME_RESPONSE:
          if (message.code === ResponseType.SUCCESS) {
            const resp = (message as any) as CreateGameResponse;
            logger.log(`Game created, gameId=${resp.gameId}`);
          }
        default:
          logger.log(`Unknown message type: ${message.type}`, "Warning");
      }

      return;
    } catch {
      logger.log(`Unable to parse message: ${data}`, "Warning");
    }
  }

  register(username: string) {
    const msg: RegisterRequest = {
      type: Type.REGISTER,
      username,
      tag: ++this.reqIdCounter,
    };
    this.ws.send(JSON.stringify(msg));
    return new Promise<ResponseType>((res, rej) => {
      this.reqsInFlight[this.reqIdCounter] = { res, rej };
    });
  }

  createGame() {
    const msg: CreateGameRequest = {
      type: Type.CREATE_GAME,
      tag: ++this.reqIdCounter,
    };
    this.ws.send(JSON.stringify(msg));
    return new Promise<ResponseType>((res, rej) => {
      this.reqsInFlight[this.reqIdCounter] = { res, rej };
    });
  }
}
