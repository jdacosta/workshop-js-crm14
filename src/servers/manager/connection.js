var DeviceConnection = require('../class/device-connection');

var io,
    deviceConnections = [];

function init(socketio) {
  io = socketio;

  // connection event
  io.sockets.on('connection', function(socket) {

    socket.on('newHosting', function() {
      newHosting(socket);
    });

    socket.on('joinHosting', function(data) {
      joinHosting(socket, data);
    });

    socket.on('disconnect', function() {
      //io.sockets.emit('disconnected');
      console.log('Disconnected');
    });
  });
}

function newHosting(socket) {
  var connectionId = Math.random().toString(36).substr(2, 4).toUpperCase(),
      room = io.sockets.adapter.rooms[connectionId];

  if (room === undefined) {
    socket.emit('newConnectionID', {
      connectionId: connectionId,
      mySocketId: socket.id
    });
    socket.join(connectionId);
    console.log('New hosting created : ' + connectionId);

    // we create new DeviceConnection
    deviceConnections[connectionId] = new DeviceConnection(connectionId, io);
    deviceConnections[connectionId].setDesktop(socket);

  } else {
    //socket.emit('error', {errroType: -1, message: 'The room ' + connectionId + ' already set, trying another one'});
    console.log('The room ' + connectionId + ' already set, trying another one');
    this.newHosting(socket);
  }
}

function joinHosting(socket, data) {
  var connectionId = data.connectionId,
      room = io.sockets.adapter.rooms[connectionId];

  if (room !== undefined) {
    if (!socket.connectionId) {

      socket.join(connectionId);
      deviceConnections[connectionId].setMobile(socket);
    }
  } else {
    console.log('The room doesn\'t exist.');
    //socket.emit('error', {errroType: -1, message: 'The room doesn\'t exist.'});
  }
}

module.exports = {
  init: init,
  newHosting: newHosting,
  joinHosting: joinHosting
};
