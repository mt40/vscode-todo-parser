import {FileType} from './FileType';
import {languages, Uri} from 'vscode';
import {SCHEME} from '../const/all'
import {UserSettings} from '../classes/UserSettings';

export class TodoType {
  content: string;
  private lineNumber: number;
  private file: FileType;
  private marker: string;

  constructor(file: FileType, content: string, line = 0, marker = "TODO") {
    this.file = file;
    this.content = content;
    this.lineNumber = line;
    this.marker = marker;
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

  getType(): string {
    return this.marker;
  }

  getSeverity(): number {
    return UserSettings.getInstance().Markers.getPriorityOf(this.marker);
  }

  getDisplayString(): string {
    let url = this.getFile().getFile().uri.toString();
    // to take it to the properline
    let middle = "#";
    // what if the file is not saved?
    if (url.split(":")[0].toString() == "untitled") {
        middle = "; Line Number: ";
    }
    let path = url + middle + this.getLineNumber();
    return `From ${path}\n----------------------------------\n${this.getContent()}`;
  }

  toString(): string {
    return this.getFile() + "\n" + this.getContent;
  }
}
