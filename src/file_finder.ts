import {workspace, Uri, TextDocument} from 'vscode';
var fs = require('fs');
var path = require('path');
import store = require('./regex_helper/regex_store');
import settings = require('./settings');

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
        let extensions = store.supportLanguages;
        let results = [], excluded = settings.Settings.getExcluded();
        console.log('Excluded: ', excluded);

        for(const ext of extensions) {
            if(excluded.indexOf(ext) >= 0)
                continue;
            results = results.concat(this.findFilesInPath(root, ext));
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
            else {
                let ext = this.getFileExtension(filename);
                if(ext === extension) {
                    console.log('-- found: ', filename);
                    results.push(filename);
                }
            }
        }
        return results;
    }

    /**
     * Parse extension from filename.
     * @return empty string if no file extension or invalid filename
     */
    private static getFileExtension(filename: string): string {
        if(!filename)
            return;
        let ext = '', temp = '';
        for(let i = filename.length - 1; i >= 0; --i) {
            let char = filename[i];
            if(char === '.') {
                ext = temp; // avoid filename without extension
                break;
            }
            temp = char + temp;
        }
        return ext;
    }
}