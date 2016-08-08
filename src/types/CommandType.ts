import {FileReader, FileFilter, Parser, OutputWriter, UserSettings} from '../classes/all';
import {FileType} from './FileType';

export interface CommandType {
  /**
   * Run the custom steps of the command
   */
  execute(): Promise<any>;
}

export class ParseCurrentFileCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      let filePrm = FileReader.readCurrentFile();
      filePrm.then(
        function (files: FileType[]) {
          files = FileFilter.filter(files);
          let todos = Parser.parse(files);
          OutputWriter.writeTodo(todos);
          resolve();
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
      let filePrm = FileReader.readProjectFiles();
      filePrm.then(
        function (files: FileType[]) {
          files = FileFilter.filter(files);
          let todos = Parser.parse(files);
          OutputWriter.writeTodo(todos);
          resolve();
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  }
}

export class ReloadUserSettingsCommand implements CommandType {
  execute(): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      UserSettings.getInstance().reload();
      resolve();
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
          OutputWriter.updateStatusBar(todos.length);
          resolve();
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  }
}
