import {window, commands, Disposable, ViewColumn, TextDocument} from 'vscode';
import ps = require('./todo_parser');

export class Worker {
    private docs: TextDocument[];

    constructor(docs: TextDocument[]) {
        this.docs = docs;
    }

    public run(callback?: any) {
        let isEmpty = true;
        let out = window.createOutputChannel('cn_todo_parser');
        out.clear();
        let index = 1, nTodos = 0;
        
        for (let doc of this.docs) {
            let todo_list = ps.TodoParser.getTodos(doc);

            if (todo_list.length > 0) {
                for (let todo of todo_list) {
                    out.appendLine(`${index}.`);
                    out.appendLine(todo.toDisplayString());
                    out.appendLine('');
                    index++;
                }
                isEmpty = false;
                nTodos = todo_list.length;
            }
        }
        if (isEmpty)
            out.appendLine('No TODOs found.');
        out.show(ViewColumn.Three);

        console.log('----------------------------------');
        console.log('Done!');

        if (callback) callback(nTodos);
    }

    public runNoOutput(callback?: any) {
        let nTodos = 0;
        for (let doc of this.docs) {
            let todo_list = ps.TodoParser.getTodos(doc);

            if (todo_list.length > 0) {
                nTodos = todo_list.length;
            }
        }
        if (callback) callback(nTodos);
    }

    dispose() {}
}