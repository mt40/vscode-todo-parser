#VSCode TODO Parser Extension
[VSCode Market](https://marketplace.visualstudio.com/items?itemName=minhthai.vscode-todo-parser) | [Github](https://github.com/kantlove/vscode-todo-parser)

Parse TODOs in your working files.

![alt text](./images/demo.gif "Demo")

##Install
- Visit the Market [here](https://marketplace.visualstudio.com/items?itemName=minhthai.vscode-todo-parser).
- Or open VSCode, press **F1** then type this command `ext install todo parser`. Press **Enter** to install.

##Usage
- Press **F1** to open your command menu. Then select **Parse TODOs**.

##How it works
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
Java, Javascript, C#, C, C++, F#, Python, Ruby, Coffee Script, R, Haskell, Lua, Go, Perl.

*Note that multi-line comment style is only supported in languages that have the syntax in the example.*

##Contribution
This is a small project by a passionate student so any contribution is welcome :)





