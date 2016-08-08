import {LanguageType} from './LanguageType';
import {Dictionary} from '../utils/all';
import {RG_JAVA, RG_PYTHON, RG_ADA, RG_FSHARP, RG_CSS, RG_LATEX} from '../data/all';

var map = new Dictionary<LanguageType, RegexType>();

export class RegexType {
  private language: LanguageType;
  private steps: RegExp[] = [];

  constructor(language: LanguageType, ...steps: string[]) {
    for(let str of steps) {
      this.steps.push(this.createRegExp(str));
    }
    this.language = language;

    map.setValue(language, this);
  }

  getSteps(): RegExp[] {
    return this.steps;
  }

  /**
   * Get a regex for parsing TODO based on a language.
   */
  static fromLanguage(language: LanguageType): RegexType {
    if (!language || !map.containsKey(language))
      return RegexLibrary.PLAINTEXT;
    return map.getValue(language);
  }

  private createRegExp(str: string): RegExp {
    return new RegExp(str, 'g'); // with global flag
  }
}

export function isSupported(language: LanguageType): boolean {
  return map.containsKey(language);
}


/**
 * Contains all suppored language and its corresponding regex.
 * To add a new language, add a new line in this class.
 * To add a new regex string, add a const in RegexStrings.ts
 */
class RegexLibrary {
  static ADA          = new RegexType(LanguageType.fromId("ada"), RG_ADA);
  static C            = new RegexType(LanguageType.fromId("c"), RG_JAVA);
  static COFFEESCRIPT = new RegexType(LanguageType.fromId("coffeescript"), RG_PYTHON);
  static CPP          = new RegexType(LanguageType.fromId("cpp"), RG_JAVA);
  static CSHARP       = new RegexType(LanguageType.fromId("csharp"), RG_JAVA);
  static CSS          = new RegexType(LanguageType.fromId("css"), RG_CSS);
  static FSHARP       = new RegexType(LanguageType.fromId("fsharp"), RG_FSHARP);
  static GO           = new RegexType(LanguageType.fromId("go"), RG_JAVA);
  static HASKELL      = new RegexType(LanguageType.fromId("haskell"), RG_ADA);
  static JAVA         = new RegexType(LanguageType.fromId("java"), RG_JAVA);
  static LATEX        = new RegexType(LanguageType.fromId("latex"), RG_LATEX);
  static LESS         = new RegexType(LanguageType.fromId("less"), RG_JAVA);
  static LUA          = new RegexType(LanguageType.fromId("lua"), RG_ADA);
  static MARKDOWN     = new RegexType(LanguageType.fromId("markdown"), RG_JAVA);
  static PERL         = new RegexType(LanguageType.fromId("perl"), RG_PYTHON);
  static PLAINTEXT    = new RegexType(LanguageType.fromId("plaintext"), RG_JAVA);
  static PYTHON       = new RegexType(LanguageType.fromId("python"), RG_PYTHON);
  static R            = new RegexType(LanguageType.fromId("r"), RG_PYTHON);
  static RUBY         = new RegexType(LanguageType.fromId("ruby"), RG_PYTHON);
  static SASS         = new RegexType(LanguageType.fromId("sass"), RG_JAVA);
}