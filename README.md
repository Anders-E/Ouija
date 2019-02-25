# Ouija
Multiplayer HTML5 Ouija board running on Node.js with Express.js and Socket.IO.

## Run Ouija
To run the Ouija server:

```
$ git clone https://github.com/Anders-E/Ouija.git
$ cd Ouija
$ npm install
$ npm run build-ts
$ npm start
```

Once the server is up and running, open `http://localhost:3000/` in your browser.

## Run Ouija for development (auto-reload on changes)
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
