import * as assert from 'assert';
import {UserSettings, SetSettingEntry, MarkersSettingEntry} from '../../src/classes/all';
var Chance = require('chance');

const chance = new Chance();

function randomChar() {
  return chance.character({ alpha: true }); // only alpha-numeric chars
}

function randomString() {
  return chance.string({ length: randomIntRange(2, 10) });
}

function randomBool() {
  return chance.bool();
}

function randomInt(): number {
  return chance.integer();
}

function randomIntRange(min, max): number {
  return chance.integer({ "min": min, "max": max });
}

function randomItem(): any {
  let rand = [randomInt(), randomBool(), randomChar(), randomString()];
  return rand[randomIntRange(0, rand.length - 1)];
}

function randomArray(size: number): any[] {
  let rs = [];
  for (let i = 0; i < size; ++i) {
    rs.push(randomItem());
  }
  return rs;
}

function randomRepeatingArray(size: number, baseLength: number): any[] {
  assert.equal(size % baseLength, 0, "Must be divisible.");
  let base = [], rs = [];
  for (let i = 0; i < baseLength; ++i) {
    base.push(randomItem());
  }
  for(let i = 0; i < size / baseLength; ++i) {
    rs = rs.concat(base);
  }
  return rs;
}

suite("Classes - UserSettings", function () {
  test("[a, b] -> [a, b]", () => {
    let value = randomArray(2);
    let entry = new SetSettingEntry<any[]>("entryName", []);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, 
      value.length, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let v of value) {
      assert.ok(
        entry.contains(v), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("[a, a] -> [a]", () => {
    const size = 2, base = 1;
    let value = randomRepeatingArray(size, base);
    let entry = new SetSettingEntry<any[]>("entryName", []);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, base, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let i = 0; i < base; ++i) {
      assert.ok(
        entry.contains(value[i]), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("[a, b, a, b] -> [a, b]", () => {
    const size = 4, base = 2;
    let value = randomRepeatingArray(size, base);
    let entry = new SetSettingEntry<any[]>("entryName", []);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, base, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let i = 0; i < base; ++i) {
      assert.ok(
        entry.contains(value[i]), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("[] -> []", () => {
    let value = [];
    let entry = new SetSettingEntry<any[]>("entryName", []);
    entry.setValue(value);

    assert.equal(entry.getValue().length, 0);
  });

  test("undefined -> []", () => {
    let value = undefined;
    let entry = new SetSettingEntry<any[]>("entryName", []);
    entry.setValue(value);

    assert.ok(entry.getValue());
    assert.equal(entry.getValue().length, 0);
  });

  const _default = ["def"];
  test("[_default, a] -> [_default, a]", () => {
    let value = _default.concat([randomItem()]);
    let entry = new MarkersSettingEntry("markerEntryName", _default);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, 
      value.length, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let v of value) {
      assert.ok(
        entry.contains(v), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("[_default, _default] -> [_default]", () => {
    let value = _default.concat(_default);
    let entry = new MarkersSettingEntry("markerEntryName", _default);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, 
      _default.length, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let i = 0; i < _default.length; ++i) {
      assert.ok(
        entry.contains(_default[i]), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("[a, b] -> [_default, a, b]", () => {
    let value = randomArray(2);
    let merged = _default.concat(value);
    let entry = new MarkersSettingEntry("markerEntryName", _default);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, 
      merged.length, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let i = 0; i < merged.length; ++i) {
      assert.ok(
        entry.contains(merged[i]), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("[] -> [_default]", () => {
    let value = [];
    let entry = new MarkersSettingEntry("markerEntryName", _default);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, 
      _default.length, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let i = 0; i < _default.length; ++i) {
      assert.ok(
        entry.contains(_default[i]), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });

  test("undefined -> [_default]", () => {
    let value = undefined;
    let entry = new MarkersSettingEntry("markerEntryName", _default);
    entry.setValue(value);

    assert.equal(
      entry.getValue().length, 
      _default.length, 
      `\nExpected: ${value}\nGot: ${entry.getValue()}`
    );
    for(let i = 0; i < _default.length; ++i) {
      assert.ok(
        entry.contains(_default[i]), 
        `\nExpected: ${value}\nGot: ${entry.getValue()}`
      );
    }
  });
});