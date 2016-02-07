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
                matched_text = this.cleanString(matched_text);
                let id = match.index;
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
    
    private static cleanString(str: string): string {
        /* Regex is not powerful enough to strip all unwanted
        characters from the multiline comment in the first place,
        so we have to do some post processing */
        let no_space = str.trim();
        let no_leading_slash = no_space.replace(/^\/\//, '');
        let no_leading_asterisk = no_leading_slash.replace(/([\r\n]\s*\*+\/?|\/\*+|\*+\/)/g, '');
        str = no_leading_asterisk.trim();
        return str;
    }

    dispose() { }
}