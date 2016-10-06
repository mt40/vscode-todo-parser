# Build
Follow these steps to build a new package:
- See [this tutorial](https://code.visualstudio.com/docs/tools/vscecli) to install __vsce__.
- Change the version number in `package.json`.
- At the root level, run the command:
  ```shell
  vsce package
  ```
- A file named something like `vscode-todo-parser....vsix` will be generated.
- Copy this file to __built_packages__ folder.

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

# Release

When ready to release a new version, do this:
- Update the changelog (CHANGELOG.md).
- Build a new package (see __Build__ section above).
- Push branch `master`.
- Create a new release on Github.
- Update the extension on [VSCode Marketplace](https://marketplace.visualstudio.com/manage/publishers/minhthai).

