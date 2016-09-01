import {Uri} from 'vscode';

export class FileUri {
  private uri: Uri;

  constructor(data: Uri | string) {
    if(typeof data === 'string') {
      this.uri = this.uriFromString(data);
    }
    else {
      this.uri = data;
    }
  }

  static fromString(path: string): FileUri {
    return new FileUri(path);
  }

  static fromUri(uri: Uri): FileUri {
    return new FileUri(uri);
  }

  getUri(): Uri {
    return this.uri;
  }

  getPath(): string {
    return this.uri.fsPath;
  }

  private uriFromString(str: string): Uri {
    return Uri.parse("file:" + str);
  }
}