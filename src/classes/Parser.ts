import {FileType, RegexType, TodoType} from '../types/all';
import {UserSettings} from './UserSettings';
import {Set, Queue, startsWithOne} from '../utils/all';

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
    let regex = file.getLanguage().getRegex();
    let blocks: Array<[string, number, string]> = [[file.getFile().getText(), 0, ""]]; // an item = [text, line number, marker]
    
    if(!blocks[0])
      return todos;
    
    for(let reg of regex.getSteps()) {
      let matched = [];
      for(let item of blocks) {
        matched = matched.concat(this.matchText(item, reg));
      }
      blocks = matched;
    }

    for(let todo of blocks) {
      let item = new TodoType(file, todo[0], todo[1], todo[2]);
      todos.push(item);
    }
    return todos;
  }

  /**
   * Match text by a regex string
   * @return An array of tuples. Each tuple is [matched text, line number, marker]
   */
  private static matchText(block: [string, number], regex: RegExp): [string, number, string][] {
    let text = block[0], line = block[1];
    let matches = [];
    let lineIndex = Parser.computeIndexList(text.split("\n"));
    let match;

    try {
      while (match = regex.exec(text)) {
        let marker = "";
        let matched_text = (match[1]) ? match[1] : match[0];
        [matched_text, marker] = this.refine(matched_text);
        if (!matched_text) { // there is no todo
          continue;
        }
        let lineNumber = Parser.lineNumberFromIndex(lineIndex, match.index);
        matches.push([matched_text, lineNumber, marker]);
      }
    }
    catch (e) {
    }
    finally {
      return matches;
    }
  }

  private static computeIndexList(lines: string[]): number[] {
    let index = [];
    let chars = 0, n = lines.length;
    for(let i = 0; i < n; ++i) {
      index[i] = chars;
      chars += lines[i].length + 1; // +1 for "\n" that is removed by spliting
    }
    return index;
  }

  private static lineNumberFromIndex(indices: number[], key: number) {
    let low = 0, hi = indices.length - 1;
    while(low <= hi) {
      let mid = low + (((hi - low) / 2) | 0);
      if(key >= indices[mid])
        low = mid + 1;
      else
        hi = mid - 1;
    }
    return hi + 1;
  }

  /**
   * A comment may contain non-todo lines. Remove those lines.
   * 
   * @returns {[string, string]} A tuple containing [todo text, marker].
   */
  private static refine(str: string): [string, string] {
    str = this.cleanString(str);
    let markers = UserSettings.getInstance().Markers.getMarkers();
    let marker = "";
    let lines = str.split('\n');
    let todoLines = [];

    for (let ln of lines) {
      ln = ln.trim();
      if (marker && !ln) { // empty line = end of todo
        break;
      }

     if(!marker) {
       [, marker] = startsWithOne(ln, markers);
     } 

      if (marker) {
        todoLines.push(ln);
      }
    }

    return [todoLines.join("\n"), marker];
  }

  /**
   * Regex is not powerful enough to strip all unwanted
   * characters from the multiline comment in the first place,
   * so we have to do some post processing.
   */
  private static cleanString(str: string): string {
    let no_space = str.trim();
    let no_leading_slash = no_space.replace(/^\/+/, '');
    let no_leading_asterisk = no_leading_slash.replace(/^\*+/g, '');
    no_leading_asterisk = no_leading_asterisk.replace(/^\/+/, ''); // remove slash again!
    str = no_leading_asterisk.trim();
    return str;
  }
}