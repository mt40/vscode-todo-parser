import {workspace, Uri, TextDocument} from 'vscode';
var fs = require('fs');
var path = require('path');
import store = require('./regex_helper/regex_store');

export class FileFinder {
    /**
     * Try to get all code files in current opened folder
     */
    public static findFile(): Thenable<TextDocument[]> {
        let self = this;
        let promise = new Promise(function(resolve, reject) {
            let code_files = self.findAllCodeFiles(workspace.rootPath);
            let docs_promise = self.getDocuments(code_files);

            docs_promise.then(function (docs) {
                resolve(docs);
            },
            function (reason) {
                reject(reason);
            });
        });
        return promise;
    }
    
    private static getDocuments(uris_or_strings): Thenable<TextDocument[]> {
        let ret_promise = new Promise(function(resolve, reject) {
            let docs: TextDocument[] = [];
            let counter = 0;
            for (let uri of uris_or_strings) {
                let doc_promise = workspace.openTextDocument(uri);
                doc_promise.then(function(doc: TextDocument) {
                    docs.push(doc);
                    counter++;
                    
                    if(counter == uris_or_strings.length) {
                        resolve(docs);
                    }
                },
                function(reason) {
                    reject(reason);
                });
            }
            if(counter == 0)
                resolve(docs); // no URIs at all
        });
        return ret_promise;
    }

    /**
     * Find all code files of supported languages
     */
    private static findAllCodeFiles(root: string): string[] {
        let langs = store.supportLanguages;
        let results = [];
        for(const lang of langs) {
            results = results.concat(this.findFilesInPath(root, '.' + lang));
        }
        return results;
    }
    
    /**
     * Find all code files inside the @root folder that match @extension
     */
    private static findFilesInPath(root: string, extension: string): string[] {
        if (!fs.existsSync(root)) {
            console.log("no dir ", root);
            return;
        }

        let files = fs.readdirSync(root);
        let results = [];
        for (let i = 0; i < files.length; i++) {
            let filename = path.join(root, files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                results = results.concat(this.findFilesInPath(filename, extension)); // go into sub-folder
            }
            else if (filename.indexOf(extension) >= 0) {
                console.log('-- found: ', filename);
                results.push(filename);
            }
        }
        return results;
    }
}