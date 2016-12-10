import {workspace, window, OutputChannel, StatusBarItem, StatusBarAlignment, QuickPickOptions, QuickPickItem, Selection, Range} from 'vscode';
import {TodoType, QuickPickTodoItem} from '../types/all';
import {CHANNEL_NAME} from '../const/all';
import assert = require('assert');

enum State {
  Idle,
  Begin,
  Busy
}

export class OutputQuickPick {
  private static items: QuickPickTodoItem[];
  private static options: QuickPickOptions = {
    matchOnDescription: true,
    placeHolder: "List of TODOs..."
  };

  private static state = State.Idle;
  private static lineIndex: number;

  /**
   * Begin the writing process. Must be called before calling 
   * writeTodo(...)
   */
  static begin() {
    assert(OutputQuickPick.state === State.Idle, "Previous work is not finished.");

    OutputQuickPick.lineIndex = 1;
    OutputQuickPick.items = [];
    OutputQuickPick.state = State.Begin;
  }

  /**
   * Finalize the writing process. Must be called after writeTodo(...)
   * @param todoCount Number of TODOs. Will be used to display the 
   * conclusion.
   */
  static finish(todoCount: number) {
    assert(OutputQuickPick.state === State.Busy, "There is no work to finish.");

    if (todoCount == 0)
      OutputQuickPick.items.push(new QuickPickTodoItem("No TODOs found."));

    OutputQuickPick.state = State.Idle;
  }

  /**
   * Display parsed todos in a pannel. finish() must be called
   * when writing is done.
   * @param todos List of todos to be written to the panel.
   */
  static writeTodo(todos: TodoType[]) {
    assert(OutputQuickPick.state === State.Begin || OutputQuickPick.state === State.Busy, "begin() is not called.");
    OutputQuickPick.state = State.Busy;

    if (!todos || todos.length == 0)
      return;

    for (let todo of todos) {
      OutputQuickPick.items.push(new QuickPickTodoItem(todo.getContentSingleLine(), todo.getLineNumber(), todo.getFile()));
    }
  }

  static showPanel(hideFilePath: boolean = false) {
    if (OutputQuickPick.state === State.Idle) {

      // File path is hidden, if only the TODOs of the current file are shown.
      if (hideFilePath) {
        for (let pick of OutputQuickPick.items) {
          pick.updateDescription(hideFilePath);
        }
      }

      // Show quick pick and go to TODO definition
      window.showQuickPick(OutputQuickPick.items, OutputQuickPick.options).then(i => {
        if (i != undefined) {
          let lineNumber = i.lineNumber - 1;
          if (lineNumber >= 0) {
            if (window.activeTextEditor.document == i.fileType.getFile()) {
              // Text document already open
              window.activeTextEditor.selection = new Selection(lineNumber, 0, lineNumber, 0);
              window.activeTextEditor.revealRange(new Range(lineNumber, 0, lineNumber, 0));
            } else {
              // Open the text document
              window.showTextDocument(i.fileType.getFile()).then(t => {
                t.selection = new Selection(lineNumber, 0, lineNumber, 0);
                t.revealRange(new Range(lineNumber, 0, lineNumber, 0));
              });
            }
          }
        }
      });
    }
  }
}