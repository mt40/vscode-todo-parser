import {FileType} from '../types/all';
import {UserSettings} from './UserSettings';
import {UnsupportFiles} from '../const/all';

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
    let ext = file.getExt();
    return FileFilter.checkInclusion(ext) && FileFilter.checkSupport(ext);
  }

  /**
   * Returns true if the file is not excluded by the user.
   * @param ext File extension used in this test.
   */
  static checkInclusion(ext: string): boolean {
    let setting = UserSettings.getInstance();
    if(setting.Inclusions.size() > 0)
      return setting.Inclusions.contains(ext);
    return !setting.Exclusions.contains(ext);
  }

  /**
   * Returns true if this file is supported.
   * @param ext File extension used in this test.
   */
  static checkSupport(ext: string): boolean {
    return UnsupportFiles.find(x => x === ext) === undefined;
  }
}