import {window, commands, workspace, Disposable, TextDocument, Range, Position, StatusBarAlignment, StatusBarItem} from 'vscode'; 
import wr = require('./worker');
import ff = require('./file_finder');

export class Controller {
    private _statusBarItem: StatusBarItem;
    private _disposable: Disposable;
    private _garbage: Disposable[] = [];
    
    public run() {
        let self = this;
        let docs_promise = ff.FileFinder.findFile();
        
        docs_promise.then(function(docs) {
            self.runWorker(docs);
        },
        // Cannot find files in current folder manually, switch to using the API 
        function(reason) {
            // Uncomment the line below to use the API. However, the API gives
            // bad and duplicate documents :(
            //let docs = workspace.textDocuments;
            self.runWorker([]);
        });
    }

    /**
     * Same as @run but only for the current document
     * @noOutput do not show TODOs on the screen
     */
    public runOne(noOutput = false) {
        this.runWorker([], noOutput);
    }
    
    private runWorker(docs: TextDocument[], noOutput = false) {
        // if there is no folder opened (user opened only 1 file)
        // then we take the document from the current editor
        if (docs.length == 0) {
            let editor = window.activeTextEditor;
            if (!editor) return;

            docs = [editor.document];
        }
        
        let worker = new wr.Worker(docs);
        let self = this;
        if(noOutput) { // Run to update status bar so don't need to output anything
            worker.runNoOutput(function(nTodos: number) {
                self.updateStatusBar(nTodos);
            });
        }
        else {
            worker.run();
        }
        
        this._garbage.push(worker);
    }

    private updateStatusBar(nTodos: number) {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;
        // Update the status bar
        //this._statusBarItem.text = `Todo: ${nTodos}`;
        this._statusBarItem.text = '$(checklist) ' + nTodos;
        this._statusBarItem.tooltip = (nTodos > 1) ? `${nTodos} TODOs` : `${nTodos} TODO`;
        this._statusBarItem.command = 'extension.startCurrent'; // Clicking on this will start the parser but only for the current file
        this._statusBarItem.show();
    }
    
    dispose() {
        this._statusBarItem.dispose();
    }
}