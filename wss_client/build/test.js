"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const client_1 = require("./client");
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const client = new client_1.WssClient("localhost", 8080);
    yield client.waitForConnect();
    client.register("Winston");
}))();
