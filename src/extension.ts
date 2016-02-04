
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, Range, Position, DecorationRenderOptions, DecorationOptions, MarkedString, ViewColumn} from 'vscode'; 

import ctrl = require('./controller');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	//console.log('"vscode-todo-highlighter" is now active!');
    //window.showInformationMessage('running!');

	let controller = new ctrl.Controller();
    
    var startCommand = commands.registerCommand('extension.start', () => {
        controller.run();
    });
    
    // Add to list of disposed items when deactivated
	//context.subscriptions.push(controller);
    context.subscriptions.push(startCommand);
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