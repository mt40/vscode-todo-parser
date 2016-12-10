import {FileType} from './FileType';
import {UserSettings} from '../classes/UserSettings';
import {languages, Uri} from 'vscode';
import {SCHEME} from '../const/all'

export class TodoType {
  content: string;
  contentNoTodo: string;
  private lineNumber: number;
  private file: FileType;

  constructor(file: FileType, content: string, line = 0) {
    this.file = file;
    this.content = content;
    this.lineNumber = line;

    // Remove marker, new lines and leading whitespaces
    this.contentNoTodo = content.replace(/(?:\n|\r|\n|\r)/g, " ");
    for (let m of UserSettings.getInstance().Markers.getValue()) {
      this.contentNoTodo = this.contentNoTodo.replace(m, "").trim();
    }
  }

  getContent(): string {
    return this.content;
  }

  getContentSingleLine(): string {
    return this.contentNoTodo;
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