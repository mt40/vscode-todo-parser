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
    // ok if in Inclusions (or not in Exclusions)
    let setting = UserSettings.getInstance();
    if(setting.Inclusions.size() > 0)
      return setting.Inclusions.contains(file.getExt());
    return !setting.Exclusions.contains(file.getExt());
  }
}