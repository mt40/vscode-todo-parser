
import {ExtensionContext} from 'vscode'; 
import {Main} from './main';

var main: Main;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    main = new Main(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
    if(main)
        main.deactivate();
}