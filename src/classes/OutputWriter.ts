import {window, languages, OutputChannel, Diagnostic, Range, StatusBarItem, StatusBarAlignment} from 'vscode';
import {UserSettings} from './UserSettings';
import {TodoType} from '../types/all';
import {CHANNEL_NAME} from '../const/all';
import assert = require('assert');

enum State {
  Idle,
  Begin,
  Busy
}

export class OutputWriter {
  private static outputChannel = OutputWriter.createOutputChannel();

  private static state = State.Idle;
  private static lineIndex: number;

  private static createOutputChannel(): OutputChannel {
    return window.createOutputChannel(CHANNEL_NAME);
  }

  /**
   * Begin the writing process. Must be called before calling 
   * writeTodo(...)
   */
  static begin() {
    assert(OutputWriter.state === State.Idle, "Previous work is not finished.");

    OutputWriter.lineIndex = 1;
    OutputWriter.showPanel();
    OutputWriter.state = State.Begin;    
  }

  /**
   * Finalize the writing process. Must be called after writeTodo(...)
   * @param todoCount Number of TODOs. Will be used to display the 
   * conclusion.
   */
  static finish(todoCount: number) {
    assert(OutputWriter.state === State.Busy, "There is no work to finish.");

    let channel = OutputWriter.outputChannel;    
    if (todoCount == 0)
      channel.appendLine('No TODOs found.');
    else {
      channel.appendLine('==================================');
      let unit = (todoCount > 1) ? 'TODOs' : 'TODO';
      channel.appendLine(`Found ${todoCount} ${unit}.\n`);
    }

    OutputWriter.state = State.Idle;
  }

  /**
   * Display parsed todos in a pannel. finish() must be called
   * when writing is done.
   * @param todos List of todos to be written to the panel.
   */
  static writeTodo(todos: TodoType[]) {
    assert(OutputWriter.state === State.Begin || OutputWriter.state === State.Busy, "begin() is not called.");
    OutputWriter.state = State.Busy;    

    if(!todos || todos.length == 0)
      return;
    let channel = OutputWriter.outputChannel;

    const showInProblems = UserSettings.getInstance().ShowInProblems.getValue();

    let diagnostics = showInProblems ? languages.createDiagnosticCollection("TODOs") : null;

    for (let todo of todos) {
      if (showInProblems) {
        try {
          let fileUri = todo.getFile().getFile().uri;
          let prevDiagnostics = diagnostics.get(fileUri) || [];
          // The array returned by `diagnostics.get` is read-only, so we make a shallow copy
          let diags = [].concat(prevDiagnostics);
          diags.push(new Diagnostic(
            new Range(todo.getLineNumber() - 1, 0, todo.getLineNumber() - 1, Number.MAX_VALUE), 
            todo.getContent(), 
            todo.getSeverity()
          ));

          diagnostics.set(fileUri, diags);
        }
        catch (err) {
          channel.appendLine('Error writing todos: ' + err);
          OutputWriter.lineIndex++;
        }
      }
      else {
        channel.appendLine(`${OutputWriter.lineIndex}.`);
        channel.appendLine(todo.getDisplayString());
        channel.appendLine('');
        OutputWriter.lineIndex++;
      }
    }
  }

  private static showPanel() {
    let channel = OutputWriter.outputChannel;
    if(OutputWriter.state === State.Idle) {
      channel.clear();
      channel.show(true);
    }
  }
}