import {window, StatusBarItem, StatusBarAlignment} from 'vscode';
import {PARSE_CURRENT_FILE_COMMAND, CANCEL_PARSE_ALL_FILES_COMMAND} from '../const/all';

class StatusState {
  private text: string;
  private tooltip: string;
  private command: string;

  constructor(text: string, command: string, tooltip = "") {
    this.text = text;
    this.command = command;
    this.tooltip = tooltip;
  }

  getText(): string {
    return this.text;
  }

  getCommand(): string {
    return this.command;
  }

  getTooltip(): string {
    return this.tooltip;
  }

  setText(text: string): StatusState {
    this.text = text;
    return this;
  }

  setTooltip(tooltip: string): StatusState {
    this.tooltip = tooltip;
    return this;
  }

  setCommand(command: string): StatusState {
    this.command = command;
    return this;
  }
}

export class StatusBarManager {
  private static instance: StatusBarManager;
  
  private statusBarItem: StatusBarItem;
  private defaultState: StatusState;
  private workingState: StatusState;

  constructor() {
    if(!StatusBarManager.instance) {
      StatusBarManager.instance = this;
      this.init();
    }
    return StatusBarManager.instance;
  }

  static getInstance(): StatusBarManager {
    return new StatusBarManager();
  }

  private init() {
    // Create a TODO counter for current file
    this.statusBarItem =  window.createStatusBarItem(StatusBarAlignment.Left);

    this.defaultState = new StatusState("$(checklist) 0", PARSE_CURRENT_FILE_COMMAND, "0 TODO");
    this.setState(this.defaultState);
  }

  private setState(state: StatusState) {
    this.statusBarItem.text = state.getText();
    this.statusBarItem.tooltip = state.getTooltip();
    this.statusBarItem.command = state.getCommand();
    this.statusBarItem.show();
  }

  setDefault(text?: string, tooltip?: string) {
    if(text)
      this.defaultState.setText(text);
    if(tooltip)
      this.defaultState.setTooltip(tooltip);
    this.setState(this.defaultState);
  }

  /**
   * Show a state that represents the system is working
   * on something. setDefault() must be called when finish.
   * @param text          Text to display on the status bar.
   * @param [tooltip=""]  Tooltip shows when hover.
   */
  setWorking(text: string, tooltip = "") {
    if(!this.workingState)
      this.workingState = new StatusState(text, CANCEL_PARSE_ALL_FILES_COMMAND, tooltip);
    else 
      this.workingState.setText(text).setTooltip(tooltip).setCommand(CANCEL_PARSE_ALL_FILES_COMMAND);
    this.setState(this.workingState);
  }
}