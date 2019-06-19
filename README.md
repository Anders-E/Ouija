[![CircleCI](https://circleci.com/gh/Anders-E/Ouija/tree/master.svg?style=svg)](https://circleci.com/gh/Anders-E/Ouija/tree/master)

# Ouija
Ouija is a multiplayer HTML5 Ouija board running on Node.js.
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

### Build & Run Ouija for development (auto-reload on changes, ESLint, Prettier)
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

## License

TODO
