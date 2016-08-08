import {FileType} from './FileType';

export class TodoType {
  content: string;
  private file: FileType;

  constructor(file: FileType, content: string) {
    this.file = file;
    this.content = content;
  }

  getContent(): string {
    return this.content;
  }

  getFile(): FileType {
    return this.file;
  }

  getDisplayString(): string {
    return `From ${this.getFile().getName()}\n----------------------------------\n${this.getContent()}`;
  }

  toString(): string {
    return this.getFile().toString() + "\n" + this.getContent.toString();
  }
}