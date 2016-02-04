import {window, commands, workspace, Disposable, TextDocument, Range, Position} from 'vscode'; 
import wr = require('./worker');
import ff = require('./file_finder');

export class Controller {
    private _disposable: Disposable;
    private _garbage: Disposable[] = [];
    
    public run() {
        let self = this;
        let docs_promise = ff.FileFinder.findFile();
        
        docs_promise.then(function(docs) {
            self.runWorker(docs);
        }, function(reason) {
            let docs = workspace.textDocuments;
            self.runWorker(docs);
        });
    }
    
    private runWorker(docs: TextDocument[]) {
        // if there is no folder opened (user opened only 1 file)
        // then we take the document from the current editor
        if (docs.length == 0) {
            let editor = window.activeTextEditor;
            if (!editor) return;

            docs = [editor.document];
        }
        
        let worker = new wr.Worker(docs);
        worker.run();
        
        this._garbage.push(worker);
    }
    
    dispose() {}
}