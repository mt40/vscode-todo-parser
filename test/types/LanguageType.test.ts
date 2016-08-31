import * as assert from 'assert';
import {LanguageType, LanguageName} from '../../src/types/all';

suite("LanguageType", () => {
	test("Plain text gives PLAINTEXT", () => {
    let plaintext = LanguageName.PLAINTEXT;
    assert.deepStrictEqual(LanguageType.fromId("plaintext"), plaintext);
  });

  test("Java gives JAVA", () => {
    let java = LanguageName.JAVA;
    assert.deepStrictEqual(LanguageType.fromId("java"), java);
  });

  test("Unknown gives PLAINTEXT", () => {
    let plaintext = LanguageName.PLAINTEXT;
    assert.deepStrictEqual(LanguageType.fromId("superman"), plaintext);
  });
});