import {Uri, workspace} from 'vscode';
import * as assert from 'assert';
import {FileReader} from '../../src/classes/all';
import {FileType, FileUri} from '../../src/types/all';
import {getFileExtension, getFolderName} from '../../src/utils/all';
var fs = require('fs-extra');
var Chance = require('chance');

// Where to store the generated file during the test.
const testFolder = FileUri.fromString(`${workspace.rootPath}/classes/temp/filereader`);
// Path to the predefined set of sample code files.
const sampleFolder = FileUri.fromString(`${workspace.rootPath}/sample-code-files`);
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

type RandomFile = {
  path: string;
  name: string;
}

/**
 * Returns a full path from a directory and a file name.
 * @param name  File name.
 * @param root  Parent directory.
 */
function pathFromName(name: string, root = testFolder.getPath()): string {
  return FileUri.fromString(`${root}/${name}`).getPath();
}

function pathFromSubPath(subPath: string, root = testFolder.getPath()): string {
  return FileUri.fromString(`${root}/${subPath}`).getPath();
}

/**
 * Randomly pick a file from a predefined set of samples.
 */
function fileFromSample(): SampleFile {
  let names = fs.readdirSync(sampleFolder.getPath());
  let fullPath = [];
  for(let n of names) {
    fullPath.push(pathFromName(n, sampleFolder.getPath()));
  }
  return new SampleFile(fullPath[(Math.random() * fullPath.length) | 1]);
}

/**
 * Clear the directory content. Create the directory if not exist.
 */
function clearDir(path: string) {
  fs.emptyDirSync(path);
}

function createDir(path: string) {
  fs.ensureDirSync(path);
}

function createFile(path: string, content = "") {
  fs.outputFileSync(path, content, "utf8");
}

/**
 * Returns full path of a random code file.
 */
function createRandomFile(parentDir: string): RandomFile {
  let file = fileFromSample();
  let content = fs.readFileSync(file.path, "utf8");
  let name = `${chance.word({length: LENGTH_OF_TODO_FILE})}.${file.ext}`;
  let resultPath = pathFromName(name, pathFromSubPath(parentDir));

  createFile(resultPath, content);
  return {
    path: resultPath,
    name: name
  };
}

function randomInt(min = -1 << 31, max = 1 << 31) {
  return chance.integer({"min": min, "max": max});
}

function randomString() {
  return chance.string({
    length: randomInt(1, 8), 
    pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$^&()[]"
  });
}

function randomPath(depth: number): string {
  let rs = "";
  for(let i = 0; i < depth; ++i) {
    if(i == 0)
      rs += randomString();
    else
      rs += "/" + randomString();
  }
  return rs;
}

function arrayEqual(a: any[], b: any[]) {
  a.sort();
  b.sort();
  return a.length == b.length && a.every((val, i): boolean => {
    return val === b[i];
  });
}

function collectFullPaths(files: FileType[] | RandomFile[]): string[] {
  let rs = [];
  for(let f of files) {
    if((<FileType>f).getName)
      rs.push((<FileType>f).getName());
    else
      rs.push((<RandomFile>f).path);
  }
  return rs;
}

suite("Classes - FileReader", function () { // do not use lambda here or timeout() won't work
  this.timeout(5000);
  this.slow(2000);
  this.retries(2);
  
  suiteSetup(() => {
    clearDir(testFolder.getPath());
  });

  /**
   * Create a random directory tree and distribute some random files in it.
   */
  test("0 file", function (done) {
    clearDir(testFolder.getPath());

    const subPaths = randomInt(1, 5), fileCount = 0;
    let createdPaths = [], createdFiles = [];
    // Randomize paths
    for(let i = 0; i < subPaths; ++i) {
      let path = randomPath(randomInt(1, 3));
      createdPaths.push(path);
      createDir(pathFromSubPath(path));
    }
    // Randomize files
    for (let i = 0; i < fileCount; ++i) {
      let parentDir = createdPaths[randomInt(0, createdPaths.length - 1)];
      createdFiles.push(createRandomFile(parentDir));
    }
    let found: FileType[] = [];
    FileReader.readProjectFilesInDir(
      testFolder.getPath(),
      (files: FileType[], progress, err) => {
        found = found.concat(files);
      },
      () => {
        assert.equal(found.length, fileCount);
        assert.ok(arrayEqual(collectFullPaths(found), collectFullPaths(createdFiles)));

        done();
      });
  });

  test("5 files", function (done) {
    clearDir(testFolder.getPath());

    const subPaths = randomInt(1, 5), fileCount = 5;
    let createdPaths = [], createdFiles = [];
    // Randomize paths
    for(let i = 0; i < subPaths; ++i) {
      let path = randomPath(randomInt(1, 3));
      createdPaths.push(path);
      createDir(pathFromSubPath(path));
    }
    // Randomize files
    for (let i = 0; i < fileCount; ++i) {
      let parentDir = createdPaths[randomInt(0, createdPaths.length - 1)];
      createdFiles.push(createRandomFile(parentDir));
    }
    let found: FileType[] = [];
    FileReader.readProjectFilesInDir(
      testFolder.getPath(),
      (files: FileType[], progress, err) => {
        found = found.concat(files);
      },
      () => {
        assert.equal(found.length, fileCount);
        assert.ok(arrayEqual(collectFullPaths(found), collectFullPaths(createdFiles)), "File names do not match.");

        done();
      });
  });

  test("5 files, deep directory tree.", function (done) {
    clearDir(testFolder.getPath());

    const subPaths = randomInt(1, 10), fileCount = 5;
    let createdPaths = [], createdFiles = [];
    // Randomize paths
    for(let i = 0; i < subPaths; ++i) {
      let path = randomPath(randomInt(1, 10));
      createdPaths.push(path);
      createDir(pathFromSubPath(path));
    }
    // Randomize files
    for (let i = 0; i < fileCount; ++i) {
      let parentDir = createdPaths[randomInt(0, createdPaths.length - 1)];
      createdFiles.push(createRandomFile(parentDir));
    }
    let found: FileType[] = [];
    FileReader.readProjectFilesInDir(
      testFolder.getPath(),
      (files: FileType[], progress, err) => {
        found = found.concat(files);
      },
      () => {
        assert.equal(found.length, fileCount);
        assert.ok(arrayEqual(collectFullPaths(found), collectFullPaths(createdFiles)), "File names do not match.");

        done();
      });
  });

});