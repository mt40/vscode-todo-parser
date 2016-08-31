import {commands, Uri, workspace, TextDocument, window} from 'vscode';
import * as assert from 'assert';
import {getFileExtension, getFolderName} from '../../src/utils/all';
import {CommandHandler} from '../../src/classes/all';
import {ParseCurrentFileCommand, ParseAllFilesInDirCommand} from '../../src/types/all';
var fs = require('fs-extra');
var Chance = require('chance');

// Where to store the generated file during the test.
const testFolder = Uri.parse(`file:${workspace.rootPath}/types/temp/commandtype`);
// Path to the predefined set of sample code files.
const sampleFolder = Uri.parse(`file:${workspace.rootPath}/sample-code-files`);
// Length of generated file name.
const LENGTH_OF_TODO_FILE = 5; 
const chance = new Chance();

/**
 * Represents a sample file picked from a predefined set.
 */
class SampleFile {
  path: string;
  name: string;
  ext: string;

  constructor(path: string) {
    this.path = path;
    this.name = getFolderName(path);
    this.ext = getFileExtension(this.name);
  }
}

/**
 * Returns a full path from a directory and a file name.
 * @param name  File name.
 * @param root  Parent directory.
 */
function pathFromName(name: string, root = testFolder): string {
  return Uri.parse(`file:${root.fsPath}/${name}`).fsPath;
}

/**
 * Randomly pick a file from a predefined set of samples.
 */
function fileFromSample(): SampleFile {
  let names = fs.readdirSync(sampleFolder.fsPath);
  let fullPath = [];
  for(let n of names) {
    fullPath.push(pathFromName(n, sampleFolder));
  }
  return new SampleFile(fullPath[(Math.random() * fullPath.length) | 1]);
}

/**
 * Return a randomly generated TODO.
 * @param oneline     One-line comment rule of the corresponding language.
 * @param [multiline] Multi-line comment rule.
 */
function randomTodo(oneline: string, multiline?: [string, string]): string {
  let content = "todo:" + chance.paragraph({sentences: 2});
  let isOneline = chance.bool();
  if(isOneline || !multiline) {
    content = oneline + content;
  }
  else {
    content = content.replace(".", ".\n");
    content = `${multiline[0]}${content}\n${multiline[1]}`;
  }
  return content;
}

/**
 * Clear the directory content. Create the directory if not exist.
 */
function clearDir(path: string) {
  fs.emptyDirSync(path);
}

function createFile(path: string, content = "") {
  fs.outputFileSync(path, content, "utf8");
}

/**
 * Returns full path of a random todo file.
 * @param todoCount Number of TODO to be randomly put into the file.
 */
function createTodoFile(todoCount: number): string {
  let file = fileFromSample();
  let content = fs.readFileSync(file.path, "utf8");
  let lines = content.split(/\r\n?|\n/);
  assert.ok(lines.length > 2, "Sample file too short.");
  let onelineCmt = lines[0]; // The first 2 lines specify the comment rules
  let multilineCmt = lines[1] ? lines[1].split(" ") : undefined;
  assert.ok(onelineCmt, "No comment rule is found.");
  lines.splice(0, 2);
  let selectedLines = [];

  // Select lines to insert TODO into
  for(let i = 0, j = 0; i < lines.length && j < todoCount; ++i) {
    if(chance.bool()) {
      selectedLines.push(i);
      j++;
    }
    if(i === lines.length - 1) {
      // Make sure there are enough TODOs
      for(i++; j < todoCount; i++, j++) {
        selectedLines.push(i);
      }
    }
  }

  // Insert TODOs
  for(let l of selectedLines) {
    lines.splice(l, 0, randomTodo(onelineCmt, multilineCmt));
  }

  let name = `${chance.word({length: LENGTH_OF_TODO_FILE})}.${file.ext}`;
  let resultPath = pathFromName(name);
  createFile(pathFromName(name), lines.join("\n"));
  return resultPath;
}

suite("Types - CommandType", function () { // do not use lambda here or timeout() won't work
  this.timeout(5000);
  this.slow(5000);
  this.retries(2);
  
  suiteSetup(() => {
    clearDir(testFolder.fsPath);
  });

  /**
   * Generate a random file with TODOs at random lines
   */
  test("Current file has 0 TODO.", function (done) {
    const expect = 0;
    let currentFile = Uri.parse("file:" + createTodoFile(expect));
    commands.executeCommand("vscode.open", currentFile);
    window.onDidChangeActiveTextEditor((editor) => {
      assert.ok(editor, "There is no active editor.");

      CommandHandler.handle(new ParseCurrentFileCommand()).then(
        (todoCount) => {
          assert.strictEqual(typeof todoCount, "number", "Error parsing, no result.");
          assert.equal(<number>todoCount, expect);
          done();
        },
        (reason) => {
          done(reason);
        });
    });
  });

  test("Current file has 100 TODOs.", function (done) {
    const expect = 100;
    let currentFile = Uri.parse("file:" + createTodoFile(expect));
    commands.executeCommand("vscode.open", currentFile);
    window.onDidChangeActiveTextEditor((editor) => {
      assert.ok(editor, "There is no active editor.");

      CommandHandler.handle(new ParseCurrentFileCommand()).then(
        (todoCount) => {
          assert.strictEqual(typeof todoCount, "number", "Error parsing, no result.");
          assert.equal(<number>todoCount, expect);
          done();
        },
        (reason) => {
          done(reason);
        });
    });
  });

  /**
   * Generate some random files with a random number of TODOs in total
   */
  test("5 files have 0 TODO.", function (done) {
    clearDir(testFolder.fsPath);

    const expect = 0, fileCount = 5;
    let createdFiles = [];
    for (let i = 0; i < fileCount; ++i) {
      createdFiles.push(Uri.parse("file:" + createTodoFile(expect)));
    }

    CommandHandler.handleWithParam(new ParseAllFilesInDirCommand(), testFolder.fsPath).then(
      (todoCount) => {
        assert.strictEqual(typeof todoCount, "number", "Error parsing, no result.");
        assert.equal(<number>todoCount, expect);
        done();
      },
      (reason) => {
        done(reason);
      });
  });

  test("5 files have 10 TODOs.", function (done) {
    clearDir(testFolder.fsPath);

    const expect = 10, fileCount = 5;
    let remain = expect;
    let createdFiles = [];
    for (let i = 0; i < fileCount; ++i) {
      let pick = chance.integer({min: 0, max: remain});
      if(i === fileCount - 1)
        pick = remain;
      remain -= pick;
      createdFiles.push(Uri.parse("file:" + createTodoFile(pick)));
    }

    CommandHandler.handleWithParam(new ParseAllFilesInDirCommand(), testFolder.fsPath).then(
      (todoCount) => {
        assert.strictEqual(typeof todoCount, "number", "Error parsing, no result.");
        assert.equal(<number>todoCount, expect);
        done();
      },
      (reason) => {
        done(reason);
      });
  });

});