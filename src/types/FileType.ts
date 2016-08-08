import {TextDocument} from 'vscode';
import {LanguageType} from './LanguageType';
import {hashCode} from '../utils/all';

export class FileType {
  private data: TextDocument;
  private name: string;
  private ext: string;
  private language: LanguageType;

  constructor(data: TextDocument) {
    this.data = data;
    this.name = data.fileName;
    this.ext = this.getFileExtension(this.name);
    this.language = LanguageType.fromId(data.languageId);
  }

  getFile(): TextDocument {
    return this.data;
  }

  getName(): string {
    return this.name;
  }

  /**
   * Get file extension
   */
  getExt(): string {
    return this.ext;
  }

  getLanguage(): LanguageType {
    return this.language;
  }

  /**
   * Get the file extension part.
   * @returns {string} Return an empty string if no extension
   */
  private getFileExtension(filename: string): string {
    if (!filename)
      return;
    let ext = '', temp = '';
    for (let i = filename.length - 1; i >= 0; --i) {
      let char = filename[i];
      if (char === '.') {
        ext = temp; // avoid filename without extension
        break;
      }
      temp = char + temp;
    }
    return ext;
  }
}