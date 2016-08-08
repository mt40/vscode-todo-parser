import {CommandType} from '../types/all';

export class CommandHandler {
  static handle(command: CommandType): Promise<any> {
    return command.execute();
  }
}