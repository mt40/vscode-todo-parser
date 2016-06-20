#VSCode TODO Parser Extension
[VSCode Market](https://marketplace.visualstudio.com/items?itemName=minhthai.vscode-todo-parser) | [Github](https://github.com/kantlove/vscode-todo-parser)

Parse TODOs in your working files.

![Demo](./images/demo_vscode1.2.gif "Demo")

##Install
- Visit the Market [here](https://marketplace.visualstudio.com/items?itemName=minhthai.vscode-todo-parser).
- Or open VSCode, press **F1** then type this command `ext install vscode-todo-parser`. Press **Enter** to install.

##Usage
- Press __F1__ to open the command menu then select __Parse TODOs (all files)__ to parse code files inside the opened document.
- The __TODO Counter__ on Status Bar will start automatically.
- Click on the __Counter__ to parse TODOs in the current document.

_Alternatively, in the **F1** command menu, select __Parse TODOs (current document)__ (see the demo above)_

##Settings
Currently, you can set which files you want to exclude by including
```json
"TodoParser": {
	"exclude": ["cpp"]
}
```
in your __User Settings__ (File > Preferences > User Settings). This will exclude __*.cpp__ files from __Parse TODOs (all files)__.

##What it does
- Display number of TODOs on your Status Bar

  ![status bar](./images/status_bar.jpg "Status bar")

- Detect comments that start with "TODO:", "Todo:", "todo:".
- We support both single-line and multi-line comments. For example:

```java
// TODO: this todo is valid

/* TODO: this is also ok */

/* Todo: multi-line TODOs is 
 * supported too!
 */
```

##Supported languages
Java, Javascript, C#, C, C++, F#, Python, Ruby, Coffee Script, R, Haskell, Lua, Go, Perl, Markdown.

*Note that multi-line comment style is only supported in languages that have the syntax in the example.*

##Contribution
This is a small project by a passionate student so any contribution is welcome and loved :+1:





