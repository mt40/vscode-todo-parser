import {window, commands, Disposable, TextDocument, Range, Position} from 'vscode';
import rg = require('./regex_helper/regex_factory');
import model = require('./todo_item');
import collections = require('./lib/collections/collections');

export class TodoParser {
    public static getTodos(doc: TextDocument): model.TodoItem[] {
        let docContent = doc.getText();

        /* For no reason, vscode returns duplicates matches sometimes.
        To avoid that, check if a new item exists in the set */
        let set = new collections.Set<model.TodoItem>();
        let results: model.TodoItem[] = [];
        if (docContent != "") {
            let regex = rg.RegexFactory.get(), match, indices = [];
            while (match = regex.exec(docContent)) {
                indices.push(match.index);

                //console.log('matched: ' + match[0]);

                let matched_text = (match[1]) ? match[1] : match[0];
                let id = match.index;
                let range = new Range(doc.positionAt(id), doc.positionAt(id + matched_text.length));
                let new_item = new model.TodoItem(range, matched_text, doc.fileName);
                
                if (!set.contains(new_item)) {
                    results.push(new_item);
                    set.add(new_item);
                }
            }
            // if (results.length) {
            //     console.log(`detected ${results.length} TODOs`);
            // }
        }

        return results;
    }

    dispose() { }
}