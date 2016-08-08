import {FileType, RegexType, TodoType} from '../types/all';
import {UserSettings} from './UserSettings';
import {Set, Queue} from '../utils/all';

export class Parser {
  static parse(files: FileType[]): TodoType[] {
    let todos = [];
    for(let file of files) {
      todos = todos.concat(this.parseSingleFile(file));
    }
    return todos;
  }

  private static parseSingleFile(file: FileType): TodoType[] {
    let todos = [];
    let regex = RegexType.fromLanguage(file.getLanguage());
    let textBlocks = [file.getFile().getText()];
    
    if(!textBlocks[0])
      return todos;
    
    for(let reg of regex.getSteps()) {
      let matched = [];
      for(let text of textBlocks) {
        matched = matched.concat(this.matchText(text, reg));
      }
      textBlocks = matched;
    }

    for(let todo of textBlocks) {
      let item = new TodoType(file, todo);
      todos.push(item);
    }
    return todos;
  }

  /**
   * Match text by a regex string
   */
  private static matchText(text: string, regex: RegExp): string[] {
    let matches = [], indices = [];
    let match;

    while (match = regex.exec(text)) {
      indices.push(match.index);
      let matched_text = (match[1]) ? match[1] : match[0];
      matched_text = this.refine(matched_text);
      if (!matched_text) { // there is no todo
        continue;
      }
      matches.push(matched_text);
    }
    return matches;
  }

  /**
   * A comment may contain non-todo lines. Remove those lines.
   */
  private static refine(str: string): string {
    str = this.cleanString(str);
    let markers = UserSettings.getInstance().getMarkers();
    let lines = str.split('\n');
    let todoLines = [];
    let flag = false;

    for (let ln of lines) {
      ln = ln.trim();
      if (flag && !ln) { // empty line = end of todo
        break;
      }
      if (flag || this.startsWith(ln, markers)) {
        flag = true; // signal inside a todo
        todoLines.push(ln);
      }
    }
    return todoLines.join("\n");
  }

  /**
   * Regex is not powerful enough to strip all unwanted
   * characters from the multiline comment in the first place,
   * so we have to do some post processing.
   */
  private static cleanString(str: string): string {
    let no_space = str.trim();
    let no_leading_slash = no_space.replace(/\/+/, '');
    let no_leading_asterisk = no_leading_slash.replace(/\*+/g, '');
    no_leading_asterisk = no_leading_asterisk.replace(/\/+/, ''); // remove slash again!
    str = no_leading_asterisk.trim();
    return str;
  }

  private static startsWith(str: string, markers: string[]): boolean {
    for (let marker of markers) {
      if (str.startsWith(marker))
        return true;
    }
    return false;
  }
}