"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WssClient = void 0;
const tslib_1 = require("tslib");
const ws_1 = tslib_1.__importDefault(require("ws"));
const logger_1 = require("./common/logger/logger");
const wss_1 = require("./common/proto/wss");
const logger = logger_1.Logger.create("WS_CLIENT");
class WssClient {
    constructor(host, port) {
        this.reqsInFlight = {};
        this.reqIdCounter = 0;
        this.connected = false;
        this.ws = new ws_1.default(`ws://${host}:${port}`);
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
        return new Promise((res) => {
            this.reqsInFlight[0] = res;
        });
    }
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            if (!message.type) {
                logger.log(`Parsed message contains no type: ${message}`, "Warning");
                return;
            }
            switch (message.type) {
                case wss_1.Type.REGISTER_RESPONSE:
                    if (message.code === wss_1.Codes.OK) {
                        logger.log("Register OK!");
                    }
                    break;
            }
            logger.log(`Unknown message type: ${message.type}`, "Warning");
            return;
        }
        catch (_a) {
            logger.log(`Unable to parse message: ${data}`, "Warning");
        }
    }
    register(username) {
        const msg = { type: wss_1.Type.REGISTER, username };
        this.ws.send(JSON.stringify(msg));
    }
}
exports.WssClient = WssClient;
