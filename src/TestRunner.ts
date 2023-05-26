import * as vscode from 'vscode';
import * as path from 'path';
import { quoter } from './Utils';
import { RunnerConfig } from './RunnerConfig';

export class TestRunner {
    private terminal: vscode.Terminal | undefined;

    constructor(private readonly config: RunnerConfig) { }

    public async runCurrentTest(testName: string | string, options: string[] = ['--filter']): Promise<void> {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        await editor.document.save();
        const relativePath = this.getRelativeFilePath(editor);

        if (!relativePath) {
            return;
        }

        const command = this.buildDepotCommand(relativePath, testName, options);
        // const testName = currentTestName || this.findCurrentTestName(editor);

        await this.runTerminalCommand(command);
    }

    private buildDepotCommand(filePath: string, testName: string, options?: string[]): string {
        const args = this.buildCommandArgs(filePath, testName, options);

        return `${this.config.depotCommand} ${args.join(' ')}`;
    }

    private buildCommandArgs(filePath: string, testName: string, options: string[] = []): string[] {
        const args: string[] = [];
        args.push(quoter(filePath), ...options, testName);

        return args;
    }

    private async runTerminalCommand(command: string) {
        if (!this.terminal) {
            this.terminal = vscode.window.createTerminal('depot tests');
        }

        this.terminal.show(true);
        await vscode.commands.executeCommand('workbench.action.terminal.clear');
        this.terminal.sendText(command);
    }

    private getRelativeFilePath(editor?: vscode.TextEditor): string | undefined {
        const activeEditor = editor || vscode.window.activeTextEditor;

        if (activeEditor) {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);

            if (workspaceFolder) {
                const filePath = activeEditor.document.uri.fsPath;
                const workspaceFolderPath = workspaceFolder.uri.fsPath;

                return path.relative(workspaceFolderPath, filePath).replace(/\\/g, '/');
            }
        }

        return undefined;
    }
}