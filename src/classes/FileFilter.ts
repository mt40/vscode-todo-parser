import {FileType} from '../types/all';
import {UserSettings} from './UserSettings';

export class FileFilter {
  static filter(files: FileType[]): FileType[] {
    let goodFiles = [];
    for(let file of files) {
      if(this.check(file)) {
        goodFiles.push(file);
      }
    }
    return goodFiles;
  }

  private static check(file: FileType): boolean {
    // ok if not in Exclusions
    return !UserSettings.getInstance().Exclusions.contains(file.getExt());
  }
}