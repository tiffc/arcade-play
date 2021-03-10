const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

const port = process.env.PORT || 3000;

const games = new Map();

io.on('connect', socket => {

  function updatePlayers(name, code) {
    if (games.has(code)) {
      if (games.get(code).length < 2) {
        games.get(code).push(name);
        console.log(name + ' has joined game ' + code);
        console.log('Game ' + code + ' currently has players: ' + games.get(code));
      } else {
        console.log(name + ' attempted to join game ' + code + ' but it is full')
        return false;
      }
    } else {
      games.set(code, [name]);
      console.log(name + ' has created a new game: ' + code);
      console.log('Game ' + code + ' currently has players: ' + games.get(code));
    }
    return true;
  }

  function removePlayers(name, code) {
    if (games.has(code)) {
      games.get(code).splice(games.get(code).indexOf(name), 1);
      console.log('Removed ' + name + ' from game ' + code);
      console.log('Game ' + code + ' currently has players: ' + games.get(code));
      if (!games.get(code).length) {
        games.delete(code);
        console.log('Game ' + code + ' is empty and has been deleted');
      }
    }
  }

  socket.on('game', (name, code) => {
    if (updatePlayers(name, code)) {
      socket.join(code);
      if (games.get(code).length === 2) {
        socket.to(code).emit('start', 0, games.get(code)[1]);
        socket.emit('start', 1, games.get(code)[0]);
        console.log(games.get(code)[0] + ' is player 1 and ' + games.get(code)[1] + ' is player 2')
      }
    } else {
      socket.emit('full');
    }
  });

  socket.on('move', (name, code, i) => {
    socket.to(code).emit('opponentmove', i);
    console.log(name + ' has played move ' + i);
  });

  socket.on('replay', (code) => {
    socket.to(code).emit('startreplay');
    console.log('Replaying game');
  });

  socket.on('exit', (name, code) => {
    removePlayers(name, code);
    socket.to(code).emit('opponentexit');
    socket.leave(code);
    console.log(name + ' has left game ' + code);
  });
});

nextApp.prepare().then(() => {

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port:${port}`);
  });
});