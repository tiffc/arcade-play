const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

const port = process.env.PORT || 3000;

const players = new Map();
const rooms = new Map();

io.on('connect', socket => {

  function updatePlayers(id, code) {
    players.set(id, code);
    if (rooms.has(code) && rooms.get(code).length < 2) {
      rooms.get(code).push(id);
      console.log('Player ' + id + ' has joined game ' + code);
      console.log('Game ' + code + ' currently has players: ' + rooms.get(code));
      if (rooms.get(code).length === 2) {
        io.to(rooms.get(code)[0]).emit('start', 0);
        io.to(rooms.get(code)[1]).emit('start', 1);
        console.log('Player ' + rooms.get(code)[0] + ' is 1 and player ' + rooms.get(code)[1] + ' is 2')
      }
    } else {
      rooms.set(code, [id]);
      console.log('Player ' + id + ' has created a new game: ' + code);
      console.log('Game ' + code + ' currently has players: ' + rooms.get(code));
    }
  }

  function removePlayers(id) {
    let code = players.get(id);
    if (rooms.get(code)) {
      rooms.get(code).splice(rooms.get(code).indexOf(id), 1);
      console.log('Player ' + id + ' has left game ' + code);
      console.log('Game ' + code + ' currently has players: ' + rooms.get(code));
      if (!rooms.get(code).length) {
        rooms.delete(code);
        console.log('Game ' + code + ' is empty and has been deleted');
      }
    }
    players.delete(id);
  }

  socket.on('game', (code) => {
    socket.join(code);
    updatePlayers(socket.id, code);
  });

  socket.on('move', (i) => {
    socket.to(players.get(socket.id)).emit('move', i);
    console.log('Player ' + socket.id + ' has played move ' + i);
  });

  socket.on('replay', () => {
    socket.to(players.get(socket.id)).emit('replay');
    console.log('Replaying game');
  })

  socket.on('exit', () => {
    socket.to(players.get(socket.id)).emit('exit');
    removePlayers(socket.id);
    socket.disconnect(true);
  });

  socket.on('disconnect', () => {
    removePlayers(socket.id);
    socket.disconnect(true);
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