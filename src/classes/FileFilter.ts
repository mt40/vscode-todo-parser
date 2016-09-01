import {FileType} from '../types/all';
import {UserSettings} from './UserSettings';
import {UnsupportFiles} from '../const/all';

export class FileFilter {
  static filter(files: FileType[]): FileType[] {
    let goodFiles = [];
    for(let file of files) {
      if(this.check(file.getExt())) {
        goodFiles.push(file);
      }
    }
    return goodFiles;
  }

  /**
   * Returns true if this file can be used.
   */
  private static check(ext: string): boolean {
    return UserSettings.getInstance().isFileEligible(ext);
  }
}