//var DeviceConnection = require('../class/device-connection');

var io,
    deviceConnections = [];

function init(socketio) {
  io = socketio;

  // connection event
  io.sockets.on('connection', function(socket) {

    socket.user = {
      id: Math.random().toString(36).substr(2, 16)
    };

    // get user id
    socket.on('getUserId', function() {

      // return user id (only to user)
      socket.emit('getUserId', socket.user.id);
    });

    // get users list
    socket.on('getUsersList', function() {

      // if we ask for user list, it means we are connected to peer
      deviceConnections.push(socket.user.id);

      // emit users list to everybody
      io.emit('getUsersList', deviceConnections);
    });

    // get messages
    socket.on('message', function(message) {

      console.log('MESSAGE : ' + message);

      // return send message
      socket.broadcast.emit('messageAction', message);
    });

    // disconnect
    socket.on('disconnect', function() {

      // remove user from list
      var i = 0;
      for (i; i < deviceConnections.length; i++) {
        if (deviceConnections[i] == socket.user.id) {
          deviceConnections.splice(i, 1);
        }
      }

      // emit users list to everybody
      io.emit('getUsersList', deviceConnections);
    });
  });
}

module.exports = {
  init: init
};
