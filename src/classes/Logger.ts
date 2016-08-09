export class Logger {
  private static prefix = "[todo-parser]";
  private static warnPrefix = "[warning]";
  private static errorPrefix = "[error]";

  static log(...obj: any[]) {
    for(let o of obj) {
      console.log(Logger.createString(o, Logger.prefix));
    }
  }

  static warn(...obj: any[]) {
    for(let o of obj) {
      console.log(Logger.createString(o, Logger.prefix, Logger.warnPrefix));
    }
  }

  static error(...obj: any[]) {
    for(let o of obj) {
      console.log(Logger.createString(o, Logger.prefix, Logger.errorPrefix));
    }
  }

  private static createString(obj: any, ...prefixes: string[]) {
    let prefix = "";
    for(let p of prefixes) {
      prefix += p;
    }
    return `${prefix} ${obj}`;
  }
}