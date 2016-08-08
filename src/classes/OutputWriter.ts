import {window, OutputChannel, StatusBarItem, StatusBarAlignment} from 'vscode';
import {TodoType} from '../types/all';
import {CHANNEL_NAME, PARSE_CURRENT_FILE_COMMAND} from '../data/all';

export class OutputWriter {
  private static outputChannel = OutputWriter.createOutputChannel();
  private static statusBarItem = OutputWriter.createStatusBarItem();

  private static createOutputChannel(): OutputChannel {
    return window.createOutputChannel(CHANNEL_NAME);
  }

  /**
   * Display parsed todos in a pannel
   */
  static writeTodo(todos: TodoType[]) {
    let channel = OutputWriter.outputChannel;
    let index = 1;

    channel.clear();

    for (let todo of todos) {
      channel.appendLine(`${index}.`);
      channel.appendLine(todo.getDisplayString());
      channel.appendLine('');
      index++;
    }

    if (todos.length == 0)
      channel.appendLine('No TODOs found.');
    else {
      channel.appendLine('==================================');
      let unit = (todos.length > 1) ? 'TODOs' : 'TODO';
      channel.appendLine(`Found ${todos.length} ${unit}.\n`);
    }
    channel.show(true); // show but not get focus
  }

  /**
   * Show todo count on the bottom bar.
   */
  static updateStatusBar(todoCount: number) {
    // Create as needed
    let statusBar = OutputWriter.statusBarItem;

    // Get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      statusBar.hide();
      return;
    }

    let doc = editor.document;

    // Update the status bar
    statusBar.text = '$(checklist) ' + todoCount;
    statusBar.tooltip = (todoCount > 1) ? `${todoCount} TODOs` : `${todoCount} TODO`;
    
    statusBar.show();
  }

  private static createStatusBarItem(): StatusBarItem {
    let statusItem =  window.createStatusBarItem(StatusBarAlignment.Left);
    statusItem.command = PARSE_CURRENT_FILE_COMMAND; // Clicking on this will start the parser but only for the current file
    return statusItem;
  }
}