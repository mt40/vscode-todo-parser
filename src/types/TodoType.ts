import {FileType} from './FileType';
import {languages, Uri} from 'vscode';
import {SCHEME} from '../const/all'

export class TodoType {
  content: string;
  private lineNumber: number;
  private file: FileType;

  constructor(file: FileType, content: string, line = 0) {
    this.file = file;
    this.content = content;
    this.lineNumber = line;
  }

  getContent(): string {
    return this.content;
  }

  getLineNumber(): number {
    return this.lineNumber;
  }

  getFile(): FileType {
    return this.file;
  }

  getDisplayString(): string {
    let url = this.getFile().getFile().uri.toString();
    // to take it to the properline
    let middle = "#";
    // what if the file is not saved?
    if (url.split(":")[0].toString() == "untitled") {
        middle = "; Line Number: ";
    }
    let path = url + middle + this.getLineNumber().toString();
    return `From ${path}\n----------------------------------\n${this.getContent()}`;
  }

  toString(): string {
    return this.getFile().toString() + "\n" + this.getContent.toString();
  }
}
// Todo: lol
