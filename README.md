# Ouija
[![CircleCI](https://circleci.com/gh/Anders-E/Ouija/tree/master.svg?style=svg)](https://circleci.com/gh/Anders-E/Ouija/tree/master)\
Ouija is a multiplayer Ouija board for the web.
<img src="/screenshot.png" width="600">

## Installation
Run the following commands in your terminal (UNIX/macOS) or the command prompt (Windows):
```
$ git clone https://github.com/Anders-E/Ouija.git
$ cd Ouija
$ npm install --only-prod
$ npm run build
```

## Running the Game Server

To run the game server, after installation, simply run `npm start` in the project root directory.

Once the server tells you it is up and running, open `http://localhost:3000/` in your browser.

## Contributing

### Build & Run Ouija for development
```
$ git clone https://github.com/Anders-E/Ouija.git
$ cd Ouija
$ npm install
```
Now in one terminal, start the TypeScript compiler watcher:

`$ npm run watch-ts`

And finally in another terminal run the Node.js watcher:

`$ npm run watch-node`

Once the server is up and running, open `http://localhost:3000/` in your browser.

### Code Style, ESLint & Prettier

*TODO*

### Visual Studio Code

*TODO*

## License

Ouija is licensed under [The GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) © 2019 Anders Eriksson.

Source files in the `src/client/lib` directory are third party libraries and as such, are not licensed as part of Ouija.
