import {CommandType, ParamCommandType} from '../types/all';

export class CommandHandler {
  static handle(command: CommandType): Promise<any> {
    return command.execute();
  }

  static handleWithParam(command: ParamCommandType, param: any): Promise<any> {
    return command.execute(param);
  }
}