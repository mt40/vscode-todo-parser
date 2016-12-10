import {FileReader, FileFilter, Parser, OutputWriter, OutputQuickPick, UserSettings, Logger, StatusBarManager} from '../classes/all';
import {FileType} from './FileType';
import {CancellationToken, CancellationTokenSource} from 'vscode';
import {CHECKLIST_ICON, WORKING_ICON} from '../const/all';

export interface CommandType {
  /**
   * Run the custom steps of the command
   */
  execute(): Promise<any>;
}

export interface ParamCommandType {
  execute(...params: any[]): Promise<any>;
}

var tokenSource = new CancellationTokenSource();

export class ParseCurrentFileCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      let filePrm = FileReader.readCurrentFile();
      filePrm.then(
        function (files: FileType[]) {
          files = FileFilter.filter(files);
          let todos = Parser.parse(files);
          OutputQuickPick.begin();
          OutputQuickPick.writeTodo(todos);
          OutputQuickPick.finish(todos.length);
          OutputQuickPick.showPanel(true);
          resolve(todos.length);
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  }
}

export class ParseAllFilesCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      OutputQuickPick.begin();
      let totalFiles = 0;
      let results = [], errors = [];
      FileReader.readProjectFiles(
        (files: FileType[], progress, error) => {
          if (!error) {
            files = FileFilter.filter(files);
            let todos = Parser.parse(files);
            results = results.concat(todos);
            OutputQuickPick.writeTodo(todos);
            StatusBarManager.getInstance().setWorking(`${WORKING_ICON} ${progress}%`, "Click to cancel");
            totalFiles += todos.length;
          }
          else {
            errors.push(error);
          }
        },
        () => {
          OutputQuickPick.finish(totalFiles);
          StatusBarManager.getInstance().setDefault();
          if (UserSettings.getInstance().DevMode.getValue()) {
            for (let err of errors)
              Logger.error(err);
          }
          OutputQuickPick.showPanel();
          resolve(totalFiles);
        },
        tokenSource.token);
    });
  }
}

export class ParseAllFilesInDirCommand {
  execute(root: string): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      OutputQuickPick.begin();
      let totalFiles = 0;
      let results = [], errors = [];
      FileReader.readProjectFilesInDir(
        root,
        (files: FileType[], progress, error) => {
          if (!error) {
            files = FileFilter.filter(files);
            let todos = Parser.parse(files);
            results = results.concat(todos);
            OutputQuickPick.writeTodo(todos);
            StatusBarManager.getInstance().setWorking(`${WORKING_ICON} ${progress}%`, "Click to cancel");
            totalFiles += todos.length;
          }
          else {
            errors.push(error);
          }
        },
        () => {
          OutputQuickPick.finish(totalFiles);
          StatusBarManager.getInstance().setDefault();
          if (UserSettings.getInstance().DevMode.getValue()) {
            for (let err of errors)
              Logger.error(err);
          }
          OutputQuickPick.showPanel();
          resolve(totalFiles);
        },
        tokenSource.token);
    });
  }
}

export class ReloadUserSettingsCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      UserSettings.getInstance().reload();
      resolve('User settings reload.');
    });
  }
}

export class UpdateStatusBarCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      let filePrm = FileReader.readCurrentFile();
      filePrm.then(
        function (files: FileType[]) {
          files = FileFilter.filter(files);
          let todos = Parser.parse(files);
          let n = todos.length;
          StatusBarManager.getInstance().setDefault(`${CHECKLIST_ICON} ${n}`, (n > 1) ? `${n} TODOs` : `${n} TODO`);
          resolve(todos.length);
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  }
}

export class CancelCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      tokenSource.cancel();
      resolve('Cancel triggered.');
    });
  }
}
