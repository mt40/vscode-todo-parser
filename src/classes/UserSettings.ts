import {workspace} from 'vscode';

/**
 * Keep track of user settings for this extension.
 * This class is Singleton, use getInstance()
 */
export class UserSettings {
  private static instance: UserSettings;
  private isLoaded = false;
  private SETTING_ROOT_ENTRY = "TodoParser";

  // File extension exclusion
  Exclusions = new ExclusionsSettingEntry("exclude", []);
  // Folder exclusion
  FolderExclusions = new FolderExclusionsSettingEntry("folderExclude", []);
  // TODO beginning signal
  Markers = new MarkersSettingEntry("markers", ['TODO:', 'Todo:', 'todo:']);
  // Turn on/off dev mode
  DevMode = new DevModeSettingEntry("devMode", false);

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
    let toLoad = [this.Exclusions, this.Markers, this.FolderExclusions, this.DevMode];

    if (settings) {
      for (let st of toLoad) {
        st.setValue(settings.get<any>(st.getKey()));
      }
    }
    this.isLoaded = true;
  }
}

abstract class SettingEntry<T> {
  private key: string;
  protected value: T;
  protected defaultValue: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
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
    if (value && <T>value) { // check for undefine and type compatibility
      this.value = <T>value;
      return true;
    }
    return false;
  }
}

abstract class SetSettingEntry<T extends Array<any>> extends SettingEntry<T> {
  /**
   * Try to mimic the Set data-structure because TS has no such thing
   */
  contains(obj: any) {
    return this.getValue().find(x => x === obj) !== undefined;
  }
}

class ExclusionsSettingEntry extends SetSettingEntry<string[]> {
}

class FolderExclusionsSettingEntry extends SetSettingEntry<string[]> {
}

class MarkersSettingEntry extends SetSettingEntry<string[]> {
  setValue(value: string[]): boolean {
    if (super.setValue(value)) {
      this.value = this.defaultValue.concat(this.value);
      return true;
    }
    return false;
  }
}

class DevModeSettingEntry extends SettingEntry<boolean> {
}