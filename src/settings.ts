import {workspace, WorkspaceConfiguration, Disposable} from 'vscode';

export class Settings {
    private static excluded = [];
    private static markers = [];
    private static default_markers: string[] = ['TODO:', 'Todo:', 'todo:'];

    public static isLoaded = false;

    static getExcluded(): string[] {
        if (!this.isLoaded) {
            this.reload();
        }
        return this.excluded;
    }

    static getMarkers(): string[] {
        if (!this.isLoaded) {
            this.reload();
        }
        return this.markers;
    }

    public static reload() {
        let settings = workspace.getConfiguration('TodoParser');
        if (settings) {
            let excluded = settings.get<string[]>('exclude');
            if(excluded)
                this.excluded = excluded;

            let markers = settings.get<string[]>('markers');
            if(markers)
                this.markers = this.default_markers.concat(markers);
        }
        this.isLoaded = true;
    }
}