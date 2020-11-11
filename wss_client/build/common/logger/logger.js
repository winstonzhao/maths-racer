"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const loggers = {};
class Logger {
    constructor(id) {
        this.id = id;
    }
    static create(id) {
        if (id in Object.keys(loggers)) {
            return loggers[id];
        }
        return new Logger(id);
    }
    log(message, logLevel = "Info") {
        console.log(`[${this.id}][${logLevel}] ${message}`);
    }
}
exports.Logger = Logger;
