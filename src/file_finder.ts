import {workspace, Uri, TextDocument} from 'vscode';

export class FileFinder {
    public static findFile(): Thenable<TextDocument[]> {
        let self = this;
        let promise = new Promise(function(resolve, reject) {
            let uris_promise = self.findFileUris();
            
            uris_promise.then(function(uris) { // ok
                let docs_promise = self.getDocuments(uris);
                
                docs_promise.then(function(docs) { // ok
                    resolve(docs); // return list of docs
                }, function(reason) { // reject
                    reject(reason);
                });
                
            }, function(reason) { // reject
                reject(reason); // return empty
            });
        });
        return promise;
    }
    
    private static getDocuments(uris: Uri[]): Thenable<TextDocument[]> {
        let ret_promise = new Promise(function(resolve, reject) {
            let docs: TextDocument[] = [];
            let counter = 0;
            for (let uri of uris) {
                let doc_promise = workspace.openTextDocument(uri);
                doc_promise.then(function(doc: TextDocument) {
                    docs.push(doc);
                    counter++;
                    
                    if(counter == uris.length) {
                        resolve(docs);
                    }
                });
            }
            resolve(docs); // no URIs at all
        });
        return ret_promise;
    }
    
    /**
     * Find all URI of files in the current opened folder
     */
    private static findFileUris(): Thenable<Uri[]> {
        let include = '**/*.java';
        let exclude = '@(**/*.txt|**∕node_modules∕**)';
        let ret_promise = new Promise(function(resolve, reject) {
            let uri_promise = workspace.findFiles(include, exclude);
            
            uri_promise.then(function(uris) {
                resolve(uris);
            }, function(reason) {
                reject(reason);
            });
        });
        
        return ret_promise;
    }
}