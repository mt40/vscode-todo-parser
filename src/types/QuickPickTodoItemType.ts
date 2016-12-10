import {QuickPickItem, workspace} from 'vscode';
import {FileType} from './all';

export class QuickPickTodoItem implements QuickPickItem {
    public static showFileType: boolean;

    public label: string;
    public description: string;
    public detail: string;
    public lineNumber: number;
    public fileType: FileType;

    private detailReal: string;

    constructor(label: string, lineNumber: number = -1, fileType: FileType = null) {
        this.label = label;
        this.lineNumber = lineNumber;
        this.fileType = fileType;

        if (lineNumber >= 0) {
            this.description = "Line: " + lineNumber;
        }

        if (fileType != null) {
            this.detailReal = fileType.getName().replace(workspace.rootPath, "").substr(1);
            this.detail = this.detailReal;
        }
    }

    public updateDescription(hideFilePath: boolean) {
        if (hideFilePath)
            this.detail = null;
        else
            this.detail = this.detailReal;
    }
}  
