# `install-vscode-extensions`

A small CLI that installs your package's recommended VS Code extensions.

## Install

```sh
npm install --save-dev install-vscode-extensions
```

## Usage

The intended use is as a setup script when preparing a development environment. Add a `postinstall` or `prepare` script that runs `install-vscode-extensions` (or its short alias `ive`), and VS Code extensions your repo recommends get installed automatically when new developers run `npm install`.

```json
{
  "name": "my-awesome-package",
  "scripts": {
    "prepare": "install-vscode-extensions"
  },
  "devDependencies": {
    "install-vscode-extensions": "^1.1.0"
  }
}
```

The CLI reads `.vscode/extensions.json` from the current working directory, pulls the `recommendations` array out, and runs `code --install-extension <ext>` for each entry.

`.vscode/extensions.json` may include `//` and `/* */` comments (matching VS Code's own JSON-with-comments parser).

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Extensions installed (or already installed). |
| 1 | Couldn't read `.vscode/extensions.json`, no `recommendations` array, or `code` not on PATH. |
| (other) | Propagated from the `code` child process. |

## Requirements

- Node.js >= 22.
- The `code` CLI on PATH (`Shell Command: Install 'code' command in PATH` from VS Code's command palette on macOS).

## License

MIT.
