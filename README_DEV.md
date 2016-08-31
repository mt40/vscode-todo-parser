# Build
To build the __.vsix__ package, follow [this tutorial](https://code.visualstudio.com/docs/tools/vscecli) to install __vsce__.

Change the version number in `package.json`.

At the root level, run the command:
```shell
vsce package
```

A file named something like `vscode-todo-parser....vsix` will be generated.

# Testing

Testing require a folder named "sample-code-file":
- Contains sample files used to host random TODOs during testing.
- At the beginning of each file, there must be 2 line specifying the commend rule of the language. 
- For example, a file named "sample.java" should start like this:

  ```java
  //
  /* */
  static Main(String []args) {

  }
  ```
## TravisCI

TravisCI is setup to build and run the test automatically for every pushes and merge requests.

It is integrated into Github directly, no need for external server.

Make sure that the environment contains this entry:

> CODE_TESTS_WORKSPACE: ./test

For more details, read to this [guide](https://code.visualstudio.com/docs/extensions/testing-extensions#_running-tests-automatically-on-travis-ci-build-machines).

