## Content
[Design](#Design)

[Add support for a new language](#new_lang)

# Design

![][design]
*An affordable design capture technique (a.k.a taking picture)*

# <a name="new_lang"></a>Add support for a new language
To add support for a new language, follow 3 steps:
- Check out the `RegexStrings.ts` file and see if the new language requires a new regex to parse. If so, add that new regex as a constant (like the existing code).
- Add a new property in `LanguageType` to describe it. This entry require a string that VSCODE used as that **languageId**.
- Add a new property in `RegexType` to connect the language and the required regex.

[design]: ./assets/design.jpg "Design overview"