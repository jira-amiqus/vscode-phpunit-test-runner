// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PhpTestCodeLensProvider } from './PhpTestCodeLensProvider';
import { TestRunner } from './TestRunner';
import { RunnerConfig } from './RunnerConfig';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const provider = new PhpTestCodeLensProvider();
    const testRunner = new TestRunner(new RunnerConfig());
    const runTestCommand = vscode.commands.registerCommand('extension.runCurrentTest', (testName: string) => {
        testRunner.runCurrentTest(testName);
    });

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider({ language: 'php' }, provider)
    );

    context.subscriptions.push(runTestCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
