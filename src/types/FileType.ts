import {TextDocument} from 'vscode';
import {LanguageType} from './LanguageType';
import {getFileExtension} from '../utils/all';

export class FileType {
  private data: TextDocument;
  private name: string;
  private ext: string;
  private language: LanguageType;

  constructor(data: TextDocument) {
    this.data = data;
    this.name = data.fileName;
    this.ext = getFileExtension(this.name);
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
}