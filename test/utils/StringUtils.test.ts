import * as assert from 'assert';
import {getFileExtension, getFolderName} from '../../src/utils/all';
var Chance = require('chance');

const chance = new Chance();

type FileName = {
  fullname: string;
  name: string;
  ext: string;
}

type FilePath = {
  fullpath: string,
  folderName: string
}

function randomInt(min = -1 << 31, max = 1 << 31) {
  return chance.integer({"min": min, "max": max});
}

function randomString() {
  return chance.string({
    length: randomInt(1, 8), 
    pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&()[]"
  });
}

function randomExt() {
  return chance.word({length: randomInt(1, 3)});
}

function randomFilename(emptyPrefix = false, postfixCount = 1): FileName {
  let prefix = emptyPrefix? "" : randomString();
  let ext = "", postfix = "";
  for(let i = 0; i < postfixCount; ++i) {
    ext = randomExt();
    postfix += "." + ext;
  }
  return {
    fullname: prefix + postfix, 
    name: prefix, 
    ext: ext
  };
}

function randomPath(depth: number): FilePath {
  let rs = "", folder = "";
  for(let i = 0; i < depth; ++i) {
    folder = randomString();
    rs += "/" + folder;
  }
  return {
    fullpath: rs,
    folderName: folder
  };
}

suite("Utils - StringUtils", () => {
	test("a.b -> b", () => {
    let filename = randomFilename();
    let ext = getFileExtension(filename.fullname);
    assert.strictEqual(ext, filename.ext);
  });

  test("a. -> Empty string", () => {
    let filename = randomFilename(false, 0);
    let ext = getFileExtension(filename.fullname);
    assert.strictEqual(ext, "");
  });

  test(".b -> b", () => {
    let filename = randomFilename(true);
    let ext = getFileExtension(filename.fullname);
    assert.strictEqual(ext, filename.ext);
  });

  test("a.b.c -> c", () => {
    let filename = randomFilename(false, 2);
    let ext = getFileExtension(filename.fullname);
    assert.strictEqual(ext, filename.ext);
  });

  test("/a/b -> b", () => {
    let folder = getFolderName("/home/user");
    assert.strictEqual(folder, "user");
  });

  test("/a/b/ -> b", () => {
    let folder = getFolderName("/home/user/");
    assert.strictEqual(folder, "user");
  });

  test("/ -> Empty string", () => {
    let folder = getFolderName("/");
    assert.strictEqual(folder, "");
  });

  test("/a/b/ -> b", () => {
    let folder = getFolderName("/home/user/");
    assert.strictEqual(folder, "user");
  });

  test("/a/.../b -> b", () => {
    let path = randomPath(randomInt(2, 10));
    let folder = getFolderName(path.fullpath);
    assert.strictEqual(folder, path.folderName, `Failed case: ${path.fullpath}`);
  });
});