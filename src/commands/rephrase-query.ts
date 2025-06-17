import * as vscode from 'vscode';

export function rephraseQuery(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension-plop.rephrase-query', async () => {
    const editor = vscode.window.activeTextEditor;
    let input: string | undefined;

    if (editor && !editor.selection.isEmpty) {
      input = editor.document.getText(editor.selection);
      console.log('Using selected text as input:', input);
    } else {
      input = await vscode.window.showInputBox({
        prompt: "Enter question: ",
        placeHolder: "Enter question here"
      });

      if (!input) {
        vscode.window.showWarningMessage("No input provided");
        console.log('User cancelled input or left it empty.');
        return;
      }
    }

    try {
      console.log('Sending API request with input:', input);

      const response = await fetch('https://simpliq-backend-dem.bdp.wdc.com/rephrase_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_question: input,
          datasource: 5,
          conversation_id: 1096,
          is_primary_chat: true,
          do_cache: false,
          cached_sql_query: ""
        })
      });

      console.log('API responded with status:', response.status);

      if (!response.ok) {
        throw new Error(`API responded with status code ${response.status}`);
      }

      const data = await response.json();

      console.log('API response data:', data);
      vscode.window.showInformationMessage('API Response: ' + JSON.stringify(data));
    } catch (err: any) {
      console.error('Fetch error:', err);
      vscode.window.showErrorMessage('API Failed: ' + err.message);
    }
  });

  context.subscriptions.push(disposable);
}
