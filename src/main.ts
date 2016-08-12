import {ExtensionContext} from 'vscode'; 
import {CommandListener, CommandHandler, Logger, UserSettings} from './classes/all';
import {CommandType, FileType} from './types/all';

export class Main {
  // Required for disposing
  private context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
    this.init();
  }

  private init() {
    CommandListener.listen(this.context, this.process);    
  }

  private process(command: CommandType) {
    let resultPrm = CommandHandler.handle(command);
    resultPrm.then(
      function(result) {
        if(UserSettings.getInstance().DevMode.getValue())
          Logger.log(result + ' todos.');
      },
      function(reason) {
        if(UserSettings.getInstance().DevMode.getValue())
          Logger.error(reason);
      }
    )
  }

  /**
   * Is called when the extension is deactivated
   */
  deactivate() {}
}