// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, Range, Position, DecorationRenderOptions, DecorationOptions, MarkedString} from 'vscode'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	console.log('"vscode-todo-highlighter" is now active!');window.showInformationMessage('running!');

	let highlighter = new Highlighter();
    let controller = new Controller(highlighter);
    
    // Add to list of disposed items when deactivated
	context.subscriptions.push(controller);
    context.subscriptions.push(highlighter);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class DcOps implements DecorationRenderOptions {
    color: string;
    
    constructor(color: string) {
        this.color = color;
    }
}

class Highlighter {
    public update() {
        let editor = window.activeTextEditor;
        if(!editor) {
            return;
        }
        
        let doc = editor.document;
        let todo_list = this.getTodo(doc);
        if(todo_list.length > 0) {
            let options = new DcOps('blue');
            // TODO: bug here!
            editor.setDecorations(window.createTextEditorDecorationType(options), [todo_list[0]]);
            console.log(todo_list);
        }
    }
    
    private getTodo(doc: TextDocument): Range[] {
        let docContent = doc.getText(); 
 
        // Parse out unwanted whitespace so the split is accurate 
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' '); 
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
        
        let results : Range[] = [];
        if (docContent != "") {
            let regex = /\/\/todo/g, match, indices = [];
            while (match = regex.exec(docContent)) {
                indices.push(match.index);
            }
            let count = 0;
            for(let m of indices) {
                results.push(new Range(doc.positionAt(m), doc.positionAt(m + 6)));
                count++;
            }
            if(count) {
                console.log(`detected ${count} TODOs`);
            }
        } 
          
        return results; 
    }
    
    dispose() {}
}

class Controller {
    private _highlighter: Highlighter;
    private _disposable: Disposable;
    
    constructor(highlighter: Highlighter) {
        this._highlighter = highlighter;
        
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        // Run highlighter for current file
        this._highlighter.update();
        
        this._disposable = Disposable.from(...subscriptions);
    }
    
    private _onEvent() {
        this._highlighter.update();
    }
    
    dispose() {}
}