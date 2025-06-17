import * as vscode from "vscode";
import { getUnstructured } from './commands/get-unstructured';
import { rephraseQuery } from './commands/rephrase-query';
import { TCL2PYViewProvider } from "./tcl2pycommandsview";
// PLOP_IMPORT_MARKER

export function activate(context: vscode.ExtensionContext) {
  getUnstructured(context);
  rephraseQuery(context);
// PLOP_REGISTER_MARKER

  const provider = new TCL2PYViewProvider();
  vscode.window.registerTreeDataProvider('tcl2pyCommands', provider);
}
