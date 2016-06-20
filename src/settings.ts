import {workspace, WorkspaceConfiguration, Disposable} from 'vscode';

export class Settings {
    private static excluded = [];

    public static isLoaded = false;

    static getExcluded(): string[] {
        if (!this.isLoaded) {
            this.reload();
        }
        return this.excluded;
    }

    public static reload() {
        let settings = workspace.getConfiguration('TodoParser');
        if (settings) {
            let userValue = settings.get<string[]>('exclude');
            if(userValue)
                this.excluded = userValue;
        }
        this.isLoaded = true;
    }
}