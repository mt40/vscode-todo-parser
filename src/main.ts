import {ExtensionContext} from 'vscode'; 
import {CommandListener, CommandHandler, FileReader, FileFilter, Parser, OutputWriter} from './classes/all';
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
      },
      function(reason) {
      }
    )
  }

  /**
   * Is called when the extension is deactivated
   */
  deactivate() {}
}