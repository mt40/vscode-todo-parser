import * as assert from 'assert';
import {sliceArray} from '../../src/utils/all';
var Chance = require('chance');

const chance = new Chance();

function randomWord() {
  return chance.word({syllables: 2});
}

function randomChar() {
  return chance.character({alpha: true}); // only alpha-numeric chars
}

function randomBool() {
  return chance.bool();
}

function randomInt(min = -1 << 31, max = 1 << 31) {
  return chance.integer({"min": min, "max": max});
}

function randomArray(size: number): any[] {
  let rs = [];
  for(let i = 0; i < size; ++i) {
  let rand = [randomInt(), randomBool(), randomChar()];
    rs.push(rand[randomInt(0, rand.length - 1)]);
  }
  return rs;
}

function arrayEqual(a: any[], b: any[]) {
  return a.length == b.length && a.every((val, i): boolean => {
    return val === b[i];
  });
}

/**
 * Flatten the array 1-level deep. Ex: [[a], [b]] -> [a, b]
 * @param array Array to be flattened.
 */
function arrayFlatten(array: any[]) {
  return [].concat.apply([], array);
}

suite("Utils - ArrayUtils", () => {
	test("Empty array -> Empty array", () => {
    for(let i = 0; i < 5; ++i) {
      let rs = sliceArray([], chance.integer());
      assert.equal(rs.length, 0);
    }
  });

  test("1 element, chunkSize = 0 -> Empty array", () => {
    let rs = sliceArray(randomArray(1), 0);
    assert.equal(rs.length, 0);
  });

  test("1 element, chunkSize = 1 -> Array contains the original array", () => {
    let original = randomArray(1);
    let rs = sliceArray(original, 1);
    assert.equal(rs.length, 1);
    assert.ok(arrayEqual(rs[0], original));
  });

  test("1 element, chunkSize = 1 -> Array contains the original array", () => {
    let original = randomArray(1);
    let rs = sliceArray(original, 1);
    assert.equal(rs.length, 1);
    assert.ok(arrayEqual(arrayFlatten(rs), original));
  });

  test("1 element, chunkSize = 2 -> Array contains the original array", () => {
    let original = randomArray(1);
    let rs = sliceArray(original, 2);
    assert.equal(rs.length, 1);
    assert.ok(arrayEqual(arrayFlatten(rs), original));
  });

  test("10 element, chunkSize = 2 -> [[6 items], [4 items]]", () => {
    let original = randomArray(10), chunk = 6;
    let rs = sliceArray(original, chunk);
    assert.equal(rs.length, 2);
    assert.equal(rs[0].length, chunk);
    assert.equal(rs[1].length, original.length - chunk);
    assert.ok(arrayEqual(arrayFlatten(rs), original));
  });

  test("1000 element, chunkSize = 2 -> [...500 items...]", () => {
    let original = randomArray(1000), chunk = 2;
    let rs = sliceArray(original, chunk);
    assert.equal(rs.length, Math.floor(original.length / chunk));
    assert.ok(arrayEqual(arrayFlatten(rs), original));
  });
});