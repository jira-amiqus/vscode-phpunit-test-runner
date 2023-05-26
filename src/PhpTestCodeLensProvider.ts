import {
    Command,
    CodeLens,
    TextDocument,
    CodeLensProvider,
    CancellationToken,
} from 'vscode';


export class PhpTestCodeLensProvider implements CodeLensProvider {
    public async provideCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
        const codeLenses: CodeLens[] = [];

        const regex = /function\s+(test_[\w\d_]+)\(/g;
        const text = document.getText();

        let match;

        while ((match = regex.exec(text))) {
            const line = document.lineAt(document.positionAt(match.index).line);
            const range = line.range;

            const runTestCommand: Command = {
                title: 'Depot test',
                command: 'extension.runCurrentTest',
                arguments: [match.at(1)?.trim()],
            };

            const codeLens = new CodeLens(range, runTestCommand);
            codeLenses.push(codeLens);
        }

        return codeLenses;
    }
}