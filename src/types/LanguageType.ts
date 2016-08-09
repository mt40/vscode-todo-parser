import {Dictionary, hashCode} from '../utils/all';

var map = new Dictionary<string, LanguageType>();

export class LanguageType {
  private name: string;

  constructor(name: string) {
    this.name = name;
    map.setValue(name, this);
  }

  static fromId(id: string): LanguageType {
    if (!id || !map.containsKey(id))
      return LanguageName.PLAINTEXT; // default is PlainText
    return map.getValue(id);
  }

  toString(): string {
    return this.name;
  }

  hashCode(): number {
    return hashCode(this.name);
  }
}


// 19 languages
class LanguageName {
  static ADA          = new LanguageType("ada");
  static C            = new LanguageType("c");
  static COFFEESCRIPT = new LanguageType("coffeescript");
  static CPP          = new LanguageType("cpp");
  static CSHARP       = new LanguageType("csharp");
  static CSS          = new LanguageType("css");
  static FSHARP       = new LanguageType("fsharp");
  static GO           = new LanguageType("go");
  static HASKELL      = new LanguageType("haskell");
  static JAVA         = new LanguageType("java");
  static LATEX        = new LanguageType("latex");
  static LESS         = new LanguageType("less");
  static LUA          = new LanguageType("lua");
  static MARKDOWN     = new LanguageType("markdown");
  static PERL         = new LanguageType("perl");
  static PLAINTEXT    = new LanguageType("plaintext");
  static PYTHON       = new LanguageType("python");
  static R            = new LanguageType("r");
  static RUBY         = new LanguageType("ruby");
  static SCSS         = new LanguageType("scss");
  static TYPESCRIPT   = new LanguageType("typescript");
}