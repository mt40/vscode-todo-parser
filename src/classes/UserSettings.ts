import {workspace} from 'vscode';

/**
 * Keep track of user settings for this extension.
 * This class is Singleton, use getInstance()
 */
export class UserSettings {
  private static instance: UserSettings;

  // File extension exclusion
  private exclusions = new SettingEntry<string[]>("exclude");
  // Folder exclusion
  private folderExclusions = new SettingEntry<string[]>("folderExclude");
  // TODO beginning signal
  private markers = new MarkersSettingEntry("markers");
  private isLoaded = false;
  private SETTING_ROOT_ENTRY = "TodoParser";

  constructor() {
    if(!UserSettings.instance) {
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
   * File extension exclusion
   */
  getExclusions(): string[] {
    return this.exclusions.getValue();
  }

  /**
   * Folder exclusion
   */
  getFolderExclusions(): string[] {
    return this.folderExclusions.getValue();
  }

  /**
   * Todo beginning signal
   */
  getMarkers(): string[] {
    return this.markers.getValue();
  }

  /**
   * Reload all settings (old ones are replaced)
   */
  reload() {
    let settings = workspace.getConfiguration(this.SETTING_ROOT_ENTRY);
    let toLoad = [this.exclusions, this.markers, this.folderExclusions];

    if (settings) {
      for(let st of toLoad) {
        st.setValue(settings.get<any>(st.getKey()));
      }
    }
    this.isLoaded = true;
  }
}

class SettingEntry<T> {
  private key: string;
  protected value: T;

  constructor(key: string) {
    this.key = key;
  }

  getKey(): string {
    return this.key;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): boolean {
    if(value && <T>value) { // check for undefine and type compatibility
      this.value = value;
      return true;
    }
    return false;
  }
}

class MarkersSettingEntry extends SettingEntry<string[]> {
  private defaultMarkers = ['TODO:', 'Todo:', 'todo:'];

  setValue(value: string[]): boolean {
    if(super.setValue(value)) {
      this.value = this.defaultMarkers.concat(this.value);
      return true;
    }
    return false;
  }
}