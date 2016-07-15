import {window, commands, Disposable, ViewColumn, TextDocument, OutputChannel} from 'vscode';
import ps = require('./todo_parser');

export class Worker {
    public static OutputChannel = Worker.createOutputChannel();

    private docs: TextDocument[];

    constructor(docs: TextDocument[]) {
        this.docs = docs;
    }

    public static createOutputChannel(): OutputChannel {
        return window.createOutputChannel('todo_parser');
    }

    public run(callback?: any) {
        let isEmpty = true;
        if(!Worker.OutputChannel)
            Worker.OutputChannel = Worker.createOutputChannel();
            
        Worker.OutputChannel.clear();
        let index = 1, nTodos = 0;
        
        for (let doc of this.docs) {
            let todo_list = ps.TodoParser.getTodos(doc);
            let n = todo_list.length;
            if (n > 0) {
                for (let todo of todo_list) {
                    Worker.OutputChannel.appendLine(`${index}.`);
                    Worker.OutputChannel.appendLine(todo.toDisplayString());
                    Worker.OutputChannel.appendLine('');
                    index++;
                }
                isEmpty = false;
                nTodos += todo_list.length;
            }
        }
        if (isEmpty)
            Worker.OutputChannel.appendLine('No TODOs found.');
        else {
            Worker.OutputChannel.appendLine('==================================================');
            let unit = (nTodos > 1) ? 'TODOs' : 'TODO';
            Worker.OutputChannel.appendLine(`Found ${nTodos} ${unit}.`);
        }
        Worker.OutputChannel.show(true); // show but not get focus

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