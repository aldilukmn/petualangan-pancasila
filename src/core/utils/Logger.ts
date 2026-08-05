export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export class Logger {
  private static level: LogLevel =
    import.meta.env.VITE_DEBUG_MODE === 'true' ? LogLevel.DEBUG : LogLevel.WARN;

  static setLevel(level: LogLevel) {
    this.level = level;
  }

  static debug(message: string, ...args: unknown[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: unknown[]) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: unknown[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  static error(message: string, ...args: unknown[]) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}
