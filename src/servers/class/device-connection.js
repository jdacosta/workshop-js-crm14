DeviceConnection = function(connectionId, io) {
  this.connectionId = connectionId;
  this.screen1 = null;
  this.screen2  = null;
  this.io = io;
};

DeviceConnection.prototype = {

  setScreen1: function(socket) {
    var _this = this;
    this.screen1 = socket;

    /*this.screen1.on('displayQuestion', function (data) {
        _this.screen2.emit('_displayQuestion_', data);
    });*/
  },

  setScreen2: function(socket) {
    var _this = this;
    this.screen2 = socket;

    // inform everyone in the room that there is a new connection between them
    this.io.sockets.in(this.connectionId).emit('newBridge');

    /*this.screen2.on('userStartExperience', function (data) {
        _this.screen1.emit('_userStartExperience_', data);
    });*/
  }
};

module.exports = DeviceConnection;
