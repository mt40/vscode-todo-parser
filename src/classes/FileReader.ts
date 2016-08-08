import {workspace, window, TextDocument, Uri} from 'vscode';
import {FileType} from '../types/all';
import {UserSettings} from './UserSettings';
var fs = require('fs');
var path = require('path');

export class FileReader {
  /**
   * Read file opened by the current text editor (or tab)
   * @returns {Promise<FileType[]>} One file only.
   */
  static readCurrentFile(): Promise<FileType[]> {
    return new Promise(function (resolve, reject) {
      if(!window.activeTextEditor) {
        reject("Failed to get active editor");
        return;
      }
      let doc = window.activeTextEditor.document;
      if(doc)
        resolve([new FileType(doc)]);
      else
        reject("Cannot get current document");
    });
  }

  /**
   * Read all files in the root folder (project folder)
   * @returns {Promise<FileType[]>} List of file found.
   */
  static readProjectFiles(): Promise<FileType[]> {
    return new Promise(function (resolve, reject) {
      let root = workspace.rootPath;
      if (!root) {
        reject("Cannot get root folder.");
        return;
      }
      let fileNames = FileReader.findFilesInPath(root);
      let file_prm = FileReader.readFileFromNames(fileNames);
      file_prm.then(
        function (files: FileType[]) {
          resolve(files);
        },
        function (reason) {
          reject(reason);
        });
    });
  }

  /**
   * Find all files in directory 'root'.
   * @param {string} root Find starting point.
   * @returns {string[]} List of file names found.
   */
  private static findFilesInPath(root: string): string[] {
    if (!fs.existsSync(root) || FileReader.isFolderExcluded(root)) { // path not exists
      return [];
    }

    let files = fs.readdirSync(root);
    let names = [];
    for (let i = 0; i < files.length; i++) {
      let filename = path.join(root, files[i]);
      let stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        names = names.concat(FileReader.findFilesInPath(filename)); // go into sub-folder
      }
      else {
        names.push(filename);
      }
    }
    return names;
  }

  /**
   * Attempt to read files given full file paths.
   * @param {any} uris_or_strings File paths
   * @returns {Promise<FileType[]>} List of file read successfully.
   */
  private static readFileFromNames(uris_or_strings): Promise<FileType[]> {
    return new Promise(function (resolve, reject) {
      let docs: FileType[] = [];
      let count = 0;

      for (let uri of uris_or_strings) {
        let docPrm = workspace.openTextDocument(uri);
        docPrm.then(
          function (doc: TextDocument) {
            if(doc) // File maybe corrupted
              docs.push(new FileType(doc));

            count++;
            // Detect and end the function early
            if (count == uris_or_strings.length) {
              resolve(docs);
            }
          },
          function (reason) {
            reject(reason);
          });
      }
      if (uris_or_strings.length == 0)
        resolve(docs); // no URIs at all
    });
  }

  private static isFolderExcluded(folderName: string): boolean {
    folderName = FileReader.getfolderName(folderName);
    return UserSettings.getInstance().getFolderExclusions().find(x => x === folderName) !== undefined;
  }

  private static getfolderName(path: string): string {
    if (!path)
      return;
    let ext = '', temp = '';
    for (let i = path.length - 1; i >= 0; --i) {
      let char = path[i];
      if (char === '/' || char === '\\') {
        ext = temp;
        break;
      }
      temp = char + temp;
    }
    return ext;
  }
}