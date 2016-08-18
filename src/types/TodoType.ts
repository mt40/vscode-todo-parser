import {FileType} from './FileType';
import {languages, Uri} from 'vscode';
import {SCHEME} from '../data/all'

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
    let path = `${this.getFile().getName()}:${this.getLineNumber()}`;
    return `From ${path}\n----------------------------------\n${this.getContent()}`;
  }

  toString(): string {
    return this.getFile().toString() + "\n" + this.getContent.toString();
  }
}