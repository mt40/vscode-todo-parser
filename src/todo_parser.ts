import {window, commands, Disposable, TextDocument, Range, Position} from 'vscode';
import rg = require('./regex_helper/regex_factory');
import model = require('./todo_item');
import collections = require('./lib/collections/collections');

export class TodoParser {
    public static getTodos(doc: TextDocument): model.TodoItem[] {
        let docContent = doc.getText();
        let regex = new rg.RegexFactory(doc.languageId).get();
        /* For no reason, vscode returns duplicates matches sometimes.
        To avoid that, check if a new item exists in the set */
        let set = new collections.Set<model.TodoItem>();
        let results: model.TodoItem[] = [];
        if (docContent != "") {
            let match, indices = [];
            while (match = regex.exec(docContent)) {
                indices.push(match.index);

                let matched_text = (match[1]) ? match[1] : match[0];
                let filter_result = this.filter(this.cleanString(matched_text));
                matched_text = filter_result[0];
                if(!matched_text) { // there is no todo
                    continue;
                }
                let skipped = filter_result[1];
                let id = match.index + skipped;
                let range = new Range(doc.positionAt(id), doc.positionAt(id + matched_text.length));
                let new_item = new model.TodoItem(range, matched_text, doc.fileName);
                
                if (!set.contains(new_item)) {
                    results.push(new_item);
                    set.add(new_item);
                }
            }
        }

        return results;
    }

    /**
     * A comment may contain non-todo text. Get the todo only.
     */
    private static filter(str: string) {
        let lines = str.split('\n');
        let markers = rg.RegexFactory.markers;
        let todo_lines = [];
        let flag = false;
        let skipped = 0; // number of char read before reaching the TODO
        for(let ln of lines) {
            ln = ln.trim();
            if(flag && !ln) { // empty line = end of todo
                break;
            }
            if(flag || this.startsWith(ln, markers)) {
                flag = true;
                todo_lines.push(ln);
            }
            else {
                skipped += ln.length + 2;
            }
        }
        return [todo_lines.join("\n"), skipped];
    }

    private static startsWith(str: string, markers: string[]): boolean {
        for(let marker of markers) {
            if(str.startsWith(marker))
                return true;
        }
        return false;
    }
    
    private static cleanString(str: string): string {
        /* Regex is not powerful enough to strip all unwanted
        characters from the multiline comment in the first place,
        so we have to do some post processing */
        let no_space = str.trim();
        let no_leading_slash = no_space.replace(/\/+/, '');
        let no_leading_asterisk = no_leading_slash.replace(/\*+/g, '');
        no_leading_asterisk = no_leading_asterisk.replace(/\/+/, ''); // remove slash again!
        str = no_leading_asterisk.trim();
        return str;
    }

    dispose() { }
}