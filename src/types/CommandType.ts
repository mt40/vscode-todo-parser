import {FileReader, FileFilter, Parser, OutputWriter, UserSettings, Logger, StatusBarManager} from '../classes/all';
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
          OutputWriter.begin();
          OutputWriter.writeTodo(todos);
          OutputWriter.finish(todos.length);
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
      OutputWriter.begin();
      let totalFiles = 0;
      let results = [], errors = [];
      FileReader.readProjectFiles(
        (files: FileType[], progress, error) => {
          if (files.length > 0) {
            files = FileFilter.filter(files);
            let todos = Parser.parse(files);
            results = results.concat(todos);
            OutputWriter.writeTodo(todos);
            StatusBarManager.getInstance().setWorking(`${WORKING_ICON} ${progress}%`, "Click to cancel");
            totalFiles += todos.length;
          }
          // We could have files available, but still have an error
          // because some of them failed to load.
          if (error) {
            errors.push(error);
          }
        },
        () => {
          OutputWriter.finish(totalFiles);
          StatusBarManager.getInstance().setDefault();
          if (UserSettings.getInstance().DevMode.getValue()) {
            for (let err of errors)
              Logger.error(err);
          }
          resolve(totalFiles);
        },
        tokenSource.token);
    });
  }
}

export class ParseAllFilesInDirCommand {
  execute(root: string): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      OutputWriter.begin();
      let totalFiles = 0;
      let results = [], errors = [];
      FileReader.readProjectFilesInDir(
        root,
        (files: FileType[], progress, error) => {
          if (!error) {
            files = FileFilter.filter(files);
            let todos = Parser.parse(files);
            results = results.concat(todos);
            OutputWriter.writeTodo(todos);
            StatusBarManager.getInstance().setWorking(`${WORKING_ICON} ${progress}%`, "Click to cancel");
            totalFiles += todos.length;
          }
          else {
            errors.push(error);
          }
        },
        () => {
          OutputWriter.finish(totalFiles);
          StatusBarManager.getInstance().setDefault();
          if (UserSettings.getInstance().DevMode.getValue()) {
            for (let err of errors)
              Logger.error(err);
          }
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
