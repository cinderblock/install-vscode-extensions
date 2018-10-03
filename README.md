# `install-vscode-extensions`

Simple binary that installs vscode extentions

## Install

```shell
npm install --save-dev install-vscode-extensions
```

```shell
yarn add --dev install-vscode-extensions
```

## Usage

The intended use for this is as a setup script when preparing a development environment.
Add a `postinstall` or `prepare` script that runs `install-vscode-extensions` (or `ive`) and your (VSCode)development environment will be ready to go:

```json
{
  "name": "my-awesome-package",
  "scripts": {
    "prepare": "install-vscode-extensions"
  },
  "devDependencies": {
    "install-vscode-extensions": "^1.0.0"
  }
}
```

`install-vscode-extensions` will find the `.vscode` folder in the current working directory, load the `extensions.json` file, and run `code --install-package ${package}` for each recommended package.

Now VSCode extensions that your package recommends are installed automatically when new developers run `npm install` or `yarn`.
