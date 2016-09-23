import {workspace, window, TextDocument, Uri, CancellationToken} from 'vscode';
import {FileType} from '../types/all';
import {UserSettings} from './UserSettings';
import {Logger} from './Logger';
import {FileFilter} from './FileFilter';
import {READ_FILE_CHUNK_SIZE} from '../const/all';
import {sliceArray, getFolderName, getFileExtension} from '../utils/all';
var fs = require('fs');
var path = require('path');

type ReadFilesCallback = (readFiles: FileType[], progress: number, error?:any) => void;
type FinishCallback = () => void;

export class FileReader {
  /**
   * The turn the file opened by the current text editor (or tab)
   */
  static readCurrentFile(): Promise<FileType[]> {
    return new Promise(function (resolve, reject) {
      if(!window.activeTextEditor) {
        //reject("Failed to get active editor");
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
   * Return a list of files found in the root folder (project folder).
   * @param callback  A callback that receives a list of recent read files.
   * @param token     Token telling the method to stop.
   */
  static readProjectFiles(callback: ReadFilesCallback, finish: FinishCallback, token?: CancellationToken) {
      let roots = UserSettings.getInstance().getExecutablePaths();
      if(!roots)
        roots = [workspace.rootPath];
      if (!roots) {
        callback([], 0, "Cannot get root folder.");
        finish();
        return;
      }

      let fileNames = [];
      for(let r of roots) {
        fileNames = fileNames.concat(FileReader.findFilesInPath(r));
      }
      let slices = sliceArray(fileNames, READ_FILE_CHUNK_SIZE);
      FileReader.readFileLoop(slices, 0, callback, finish, token);
  }

  static readProjectFilesInDir(root: string, callback: ReadFilesCallback, finish: FinishCallback, token?: CancellationToken) {
      if (!root) {
        callback([], 0, "Cannot get root folder.");
        finish();
        return;
      }

      let fileNames = FileReader.findFilesInPath(root);
      let slices = sliceArray(fileNames, READ_FILE_CHUNK_SIZE);
      FileReader.readFileLoop(slices, 0, callback, finish, token);
  }

  /**
   * Continuously reads files into TextDocument objects.
   * @param slices    Array of document name arrays.
   * @param index     Current index of @slices.
   * @param callback  A callback that receives a list of recent read files.
   * @param token     Token telling the method to stop.
   */
  private static readFileLoop(slices: Array<string[]>, index: number, callback: ReadFilesCallback, finish: FinishCallback, token?: CancellationToken) {
    if (index >= slices.length || (token && token.isCancellationRequested)) {
      finish();
      return;
    }
    let fileNames = slices[index];
    let progress = (index / slices.length * 100) | 0;
    FileReader.readFileFromNames(fileNames).then(
      function (files: FileType[]) {
        callback(files, progress);
        FileReader.readFileLoop(slices, index + 1, callback, finish,  token);
      },
      function (reason) {
        callback([], progress, reason);
        FileReader.readFileLoop(slices, index + 1, callback, finish, token);
      });
  }

  /**
   * Return files found in a directory. Each item is a full path 
   * of a file.
   * @param root  Find starting point.
   */
  private static findFilesInPath(root: string): string[] {
    if (!fs.existsSync(root) || (root != workspace.rootPath && !UserSettings.getInstance().isFolderEligible(getFolderName(root)))) { // path not exists
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
        let ext = getFileExtension(filename);
        // Check early to avoid triggering extension of excluded languages
        if(UserSettings.getInstance().isFileEligible(ext)) {
          names.push(filename);
        }
      }
    }
    return names;
  }

  /**
   * Read files given full file paths. Returns a list of file read successfully.
   * @param uris_or_strings File paths as string or Uri array.
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
}