import {workspace, Uri} from 'vscode';
import {UnsupportFiles} from '../const/all';
import {FileUri} from '../types/all';

/**
 * Keep track of user settings for this extension.
 * This class is Singleton, use getInstance()
 */
export class UserSettings {
  private static instance: UserSettings;
  private isLoaded = false;
  private SETTING_ROOT_ENTRY = "TodoParser";

  // File extension exclusion
  Exclusions = new SetSettingEntry("exclude", []);
  // File extension inclusion
  Inclusions = new SetSettingEntry("include", []);

  FolderExclusions = new SetSettingEntry("folderExclude", []);
  Only = new SetSettingEntry("only", []);
  
  // TODO beginning signal
  Markers = new MarkersSettingEntry("markers", []);
  // Whether default markers (e.g. todo, TODO) are added automatically
  AutoAddDefaultMarkers = new ToggleSettingEntry("autoDefaultMarkers", true);

  // Show in problems panel?
  ShowInProblems = new ToggleSettingEntry("showInProblems", false);

  // Turn on/off dev mode
  DevMode = new ToggleSettingEntry("devMode", false);

  constructor() {
    if (!UserSettings.instance) {
      UserSettings.instance = this;
      // init
      this.reload();
    }
    return UserSettings.instance;
  }

  static getInstance(): UserSettings {
    return new UserSettings();
  }

  /**
   * Reload all settings (old ones are replaced)
   */
  reload() {
    let settings = workspace.getConfiguration(this.SETTING_ROOT_ENTRY);
    let toLoad = [this.Exclusions, this.Inclusions, this.Markers, this.FolderExclusions, this.Only, this.AutoAddDefaultMarkers, this.ShowInProblems, this.DevMode];

    if (settings) {
      for (let st of toLoad) {
        st.setValue(settings.get<any>(st.getKey()));
      }
    }
    this.mergeSettings();
    this.isLoaded = true;
  }

  /**
   * Returns true if the folder can be used (i.e. is not
   * excluded by user)
   * @param folder Folder name to check.
   */
  isFolderEligible(folder: string): boolean {
    if(folder.length == 0)
      return true; 
    return !this.FolderExclusions.contains(folder);
  }

  /**
   * Returns true if the file extension can be used (i.e. is not
   * excluded by user)
   * @param ext The file extension (without dot).
   */
  isFileEligible(ext: string): boolean {
    if(UnsupportFiles.find(x => x === ext) !== undefined)
      return false;
    if(this.Inclusions.size() > 0)
      return this.Inclusions.contains(ext);
    return !this.Exclusions.contains(ext);
  }

  getExecutablePaths(): string[] {
    if(this.Only.size() > 0) {
      let rs = [];      
      for(let item of this.Only.getValue()) {
        try {
          let path = FileUri.fromString(workspace.rootPath + "/" + item).getPath();
          rs.push(path);
        }
        catch (error) {
          // ignore this one
        }
      }
      return rs;      
    }
    return undefined; // all paths can be used
  }

  /**
   * Merge values of settings that overlap.
   */
  mergeSettings() {
    /**
     * If both file inclusion and exclusion are specified
     * in user settings, inclusion is prefered.
     */
    if(this.Inclusions.size() > 0) {
      this.Exclusions.setValue([]);
    }

    if(this.AutoAddDefaultMarkers.getValue()) {
      this.Markers.setValue(this.Markers.getValue().concat(['TODO']));
    }
  }
}

abstract class SettingEntry<T> {
  private key: string;
  protected value: T;
  protected defaultValue: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }

  getKey(): string {
    return this.key;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: any): boolean {
    this.value = this.defaultValue;
    if (value != null && <T>value != null) { // check for undefine and type compatibility
      this.value = <T>value;
      return true;
    }
    return false;
  }
}

export class SetSettingEntry<T extends Array<any>> extends SettingEntry<T> {
  /**
   * Try to mimic the Set data-structure because TS has no such thing
   */
  contains(obj: any) {
    return this.getValue().find(x => x === obj) !== undefined;
  }

  size(): number {
    return this.getValue().length;
  }

  protected ensureUnique() {
    let value = this.getValue();
    if(value) {
      this.value = <T>value.filter((val, i): boolean => {
        return value.indexOf(val) == i;
      });
    }
  }

  setValue(value: any): boolean {
    super.setValue(value);
    this.ensureUnique();
    return true;
  }
}

export class MarkersSettingEntry extends SetSettingEntry<string[]> {
  setValue(value: string[]): boolean {
    if (super.setValue(value)) {
      this.value = this.defaultValue.concat(this.value);
      this.ensureUnique();
      return true;
    }
    return false;
  }
}

export class ToggleSettingEntry extends SettingEntry<boolean> {
}
