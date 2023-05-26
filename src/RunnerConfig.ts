import * as vscode from 'vscode';

export class RunnerConfig {
    /**
     * The command that runs jest.
     * Defaults to: node "node_modules/.bin/jest"
     */
    public get depotCommand(): string {
        // custom
        const command: string = vscode.workspace.getConfiguration().get('depotrunner.command') || '';

        return command || 'depot phpunit';
    }
}