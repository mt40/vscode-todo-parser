import store = require('../regex_helper/regex_store');

export function stringFormat(formatString: string, ...replacementArray): string {
    return formatString.replace(
        /\{(\d+)\}/g, // Matches placeholders, e.g. '{1}'
        function formatStringReplacer(match, placeholderIndex) {
            // Convert String to Number
            placeholderIndex = Number(placeholderIndex);

            // Make sure that index is within array bounds
            if (
                placeholderIndex < 0 ||
                placeholderIndex > replacementArray.length - 1
            ) {
                return placeholderIndex;
            }

            // Replace placeholder with value from replacement array
            return replacementArray[placeholderIndex];
        }
    );
}

export function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

export function getRegexSrcForLang(languageId: string): any {
    switch (languageId) {
        case 'java': return store.java;
        case 'python': return store.python;
        case 'ada': return store.ada;
        case 'c#': return store.csharp;
    }
}