const loggers: { [id: string]: Logger } = {};

export type LogLevel = "Warning" | "Error" | "Info" | "Debug";

export class Logger {
  static create(id: string): Logger {
    if (id in Object.keys(loggers)) {
      return loggers[id];
    }
    return new Logger(id);
  }

  private constructor(private id: string) {}

  log(message: string, logLevel: LogLevel = "Info") {
    console.log(`[${this.id}][${logLevel}] ${message}`);
  }
}
