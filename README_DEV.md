To build the __.vsix__ package, follow [this tutorial](https://code.visualstudio.com/docs/tools/vscecli) to install __vsce__.

Change the version number in `package.json`.

At the root level, run the command:
```shell
vsce package
```

A file named something like `vscode-todo-parser....vsix` will be generated.