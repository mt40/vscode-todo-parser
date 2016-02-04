import lib = require('../lib/lib');
import store = require('./regex_store');

/**
 * A base class for creating RegExp to parse TODOs.
 * For each language, please create a subclass and 
 * override only the getFormat() method
 */
export class RegexFactory {
    private static default_markers: string[] = ['TODO:', 'Todo:']; // match markers such as: TODO, todo, ToDo, ...
    
    /**
     * Get a format string that will be used to create a RegExp 
     * to parse TODOs. This string is different for each language
     * (because of different comment syntax).
     * Default is for plaintext
     */
    protected static getFormat(): string {
        return store.plaintext;
    }
    
    /**
     * Create a regex string from a marker
     * @param {marker} a Regex pattern that signals the start of a TODO
     */
    private static createString(markers: string[]): string {
        // merge markers into 1 string
        let merge = '(?:';
        for(let i = 0; i < markers.length; ++i) {
            let escaped = lib.escapeRegExp(markers[i]);
            merge += escaped;
            if(i < markers.length - 1)
                merge += '|';
        }
        merge += ')';
        
        // merge with the regex of the language
        let full = lib.stringFormat(this.getFormat(), merge);
        return full;
    }
    
    private static createRegExp(source: string): RegExp {
        return new RegExp(source, 'g');
    }
    
    /**
     * Create a Regular Expression object
     * @param {marker} a Regex pattern that signals the start of a TODO, default is "[Tt][Oo][Dd][Oo]\\s*:" (i.e. "TODO:", "Todo:"")
     */
    public static get(markers: string[] = this.default_markers): RegExp {
        let source = this.createString(markers);
        let regex = this.createRegExp(source);
        return regex;
    }
}