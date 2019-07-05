# Ouija
[![CircleCI](https://circleci.com/gh/Anders-E/Ouija/tree/master.svg?style=svg)](https://circleci.com/gh/Anders-E/Ouija/tree/master)\
Ouija is a multiplayer Ouija board for the web.
<img src="/screenshot.png" width="600">

## Installation
Run the following commands in your terminal (UNIX/macOS) or the command prompt (Windows):
```
$ git clone https://github.com/Anders-E/Ouija.git
$ cd Ouija
$ npm install
$ npm run build
```

## Running the Game Server

To run the game server, after installation, simply run `npm start` in the project root directory.

Once the server tells you it is up and running, open `http://localhost:3000/` in your browser.

## Contributing

### Build & Run Ouija for development
For development purposes, scripts exist to set up listeners for file changes:

| Script        | Description                                                                                       |
|---------------|---------------------------------------------------------------------------------------------------|
| watch-all     | Runs all the watchers described below                                                             |
| watch-webpack | Listens for changes in the client code and bundles it into bundle.js                              |
| watch-ts      | Listens for changes in the server code and compiles it to JavaScript                              |
| watch-node    | Runs server and listens for changes in server code. Restarts the server whenever changes are made |

For example, to run the server and watch for any changes to any code in the project simply run `npm run watch-all` and navigate to `http://localhost:3000/` in your browser.

### Code Style, ESLint & Prettier

Ouija uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to check for and fix stylistic code errors:

- To run check for stylistic errors, run `npm run style-check`.
- To fix any auto-fixable errors, run `npm run style-fix`.

It is recommended to do this before any commit to keep style as consinstent as possible.

Many editors have plugins for ESLint which displays any stylistic errors in the editor:

| Editor             | Plugins                                                                              |
|------------------- | -------------------------------------------------------------------------------------|
| Visual Studio Code | [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) |
| Atom               | [Linter](https://atom.io/packages/linter) + [linter-eslint](https://atom.io/packages/linter-eslint) |

## License

Ouija is licensed under [The GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) © 2019 Anders Eriksson.

For acknowledgements and licensing regarding third-party assets used in Ouija, see [CREDITS.md](https://github.com/Anders-E/Ouija/blob/master/CREDITS.md).

Source files in the `src/client/lib` directory are third party libraries and as such, are not licensed as part of Ouija.
