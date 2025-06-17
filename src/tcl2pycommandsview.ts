import * as vscode from 'vscode';

class CommandItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = label;
  }
}

export class TCL2PYViewProvider implements vscode.TreeDataProvider<CommandItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CommandItem | null | undefined> = new vscode.EventEmitter<CommandItem | null | undefined>();
    readonly onDidChangeTreeData: vscode.Event<CommandItem | null | undefined> = this._onDidChangeTreeData.event;


  getTreeItem(element: CommandItem): vscode.TreeItem {
    return element;
  }

  getChildren(): CommandItem[] {
    return [
      new CommandItem("Rephrase Query", {
        command: 'extension-plop.rephrase-query',
        title: "Rephrase Query"
      }),
      new CommandItem("Get Response", {
        command: 'extension-plop.get-unstructured',
        title: "Get Response"
      })
    ];
  }
}
