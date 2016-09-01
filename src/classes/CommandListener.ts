import {window, workspace, commands, ExtensionContext} from 'vscode'; 
import {ParseAllFilesCommand, ParseCurrentFileCommand, ReloadUserSettingsCommand, UpdateStatusBarCommand, CancelCommand} from '../types/CommandType';
import {PARSE_ALL_FILES_COMMAND, PARSE_CURRENT_FILE_COMMAND, CANCEL_PARSE_ALL_FILES_COMMAND} from '../const/all';

type Callback = (CommandType) => any;

export class CommandListener {
  static listen(context: ExtensionContext, callback?: Callback) {
    /**
     * Command received from button clicks
     */
    let parseAllFilesCommand = commands.registerCommand(PARSE_ALL_FILES_COMMAND, () => {
        callback(new ParseAllFilesCommand());
    });

    let parseCurrentFileCommand = commands.registerCommand(PARSE_CURRENT_FILE_COMMAND, () => {
        callback(new ParseCurrentFileCommand());
        callback(new UpdateStatusBarCommand());
    });

    let cancelParseAllFilesCommand = commands.registerCommand(CANCEL_PARSE_ALL_FILES_COMMAND, () => {
        callback(new CancelCommand());
    });

    /**
     * Command received from events
     */
    // window.onDidChangeTextEditorSelection(() => {
    //   callback(new UpdateStatusBarCommand());
    // }, this, context.subscriptions);

    window.onDidChangeActiveTextEditor(() => {
      callback(new UpdateStatusBarCommand());
    }, this, context.subscriptions);

    workspace.onDidChangeConfiguration(() => {
      callback(new ReloadUserSettingsCommand());
    }, this, context.subscriptions);

    // Add to list of disposed items when deactivated
    context.subscriptions.push(parseAllFilesCommand);
    context.subscriptions.push(parseCurrentFileCommand);

    // Parse the current file once at the beginning
    callback(new UpdateStatusBarCommand());
  }
}