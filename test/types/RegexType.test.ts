import * as assert from 'assert';
import {RegexType} from '../../src/types/all';

suite("Types - RegexType", () => {
	test("Correct number of step", () => {
    let steps = ["step1", "step2"];
    let reg = new RegexType(...steps);
    assert.equal(reg.getSteps().length, steps.length);
  });
});