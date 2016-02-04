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