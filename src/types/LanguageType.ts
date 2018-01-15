import {Dictionary, hashCode} from '../utils/all';
import {RegexType} from './RegexType';
import {RG_JAVA, RG_PYTHON, RG_ADA, RG_FSHARP, RG_CSS, RG_LATEX, RG_VB, RG_TWIG} from '../const/all';

var map = new Dictionary<string, LanguageType>();

export class LanguageType {
  private name: string;
  private regex: RegexType;

  constructor(name: string, regex: RegexType) {
    this.name = name;
    this.regex = regex;

    map.setValue(name, this);
  }

  getRegex(): RegexType {
    return this.regex;
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
export class LanguageName {
  static ADA          = new LanguageType("ada", new RegexType(RG_ADA));
  static C            = new LanguageType("c", new RegexType(RG_JAVA));
  static COFFEESCRIPT = new LanguageType("coffeescript", new RegexType(RG_PYTHON));
  static CPP          = new LanguageType("cpp", new RegexType(RG_JAVA));
  static CSHARP       = new LanguageType("csharp", new RegexType(RG_JAVA));
  static CSS          = new LanguageType("css", new RegexType(RG_CSS));
  static FSHARP       = new LanguageType("fsharp", new RegexType(RG_FSHARP));
  static GO           = new LanguageType("go", new RegexType(RG_JAVA));
  static HASKELL      = new LanguageType("haskell", new RegexType(RG_ADA));
  static JAVA         = new LanguageType("java", new RegexType(RG_JAVA));
  static LATEX        = new LanguageType("latex", new RegexType(RG_LATEX));
  static LESS         = new LanguageType("less", new RegexType(RG_JAVA));
  static LUA          = new LanguageType("lua", new RegexType(RG_ADA));
  static MARKDOWN     = new LanguageType("markdown", new RegexType(RG_JAVA));
  static PERL         = new LanguageType("perl", new RegexType(RG_PYTHON));
  static PHP          = new LanguageType("php", new RegexType(RG_JAVA));
  static PLAINTEXT    = new LanguageType("plaintext", new RegexType(RG_JAVA));
  static POWERSHELL   = new LanguageType("powershell", new RegexType(RG_PYTHON));
  static PYTHON       = new LanguageType("python", new RegexType(RG_PYTHON));
  static R            = new LanguageType("r", new RegexType(RG_PYTHON));
  static RUBY         = new LanguageType("ruby", new RegexType(RG_PYTHON));
  static SASS         = new LanguageType("sass", new RegexType(RG_JAVA));
  static TYPESCRIPT   = new LanguageType("typescript", new RegexType(RG_JAVA));
  static ELIXIR       = new LanguageType("elixir", new RegexType(RG_PYTHON));
  static BASH         = new LanguageType("shellscript", new RegexType(RG_PYTHON));
  static VB           = new LanguageType("vb", new RegexType(RG_VB));
  static TWIG         = new LanguageType("twig", new RegexType(RG_TWIG));
  static YAML         = new LanguageType("yaml", new RegexType(RG_PYTHON));
  static MATLAB       = new LanguageType("matlab", new RegexType(RG_LATEX));
}