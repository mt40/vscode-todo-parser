import {Range} from 'vscode';
import collections = require('./lib/collections/collections');

export class TodoItem {
    public range: Range;
    public text: string;
    public fileName: string;
    
    constructor(range: Range, text: string, fileName='unknown') {
        this.range = range;
        this.text = text;
        this.fileName = fileName;
        
        this.process();
    }
    
    private process() {
        this.text = this.text.trim();
    }
    
    public toDisplayString(): string {
        let line = this.range.start.line;
        let col = this.range.start.character;
        return `File ${this.fileName}. Line ${line}, column ${col}\n----------------------------------\n${this.text}`;
    }
    
    toString() {
        /* Because typescript collections use string as key so
        toString() is used instead of hashCode() */
        // makeString joins all properties into 1 string 
        return collections.utils.makeString(this);
    }
}