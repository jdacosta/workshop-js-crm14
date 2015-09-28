var Hapi       = require('hapi'),
    Inert      = require('inert'),
    Routes     = require('./config/routes'),
    Config     = require('./config/config');
    Connection = require('./manager/connection');

var app = {}, io;
app.config = Config;

var server = new Hapi.Server();
server.connection({
    port: parseInt(process.env.PORT, 10) || app.config.server.port,
    host: app.config.server.host
});

server.register([
  Inert,
  {
    register: require('good'),
    options: {
      opsInterval: 10000,
      reporters: [{
        reporter: require('good-console'),
        events: {
          request: '*',
          log: '*',
          response: '*',
          error: '*'
        }
      }]
    }
  }
], function (error) {
  if (error) {
    console.error(error);
  } else {
    io = require('socket.io')(server.listener);

    Connection.init(io);

    server.route(Routes.endpoints);

    server.start(function () {
      console.log('Server started at: ' + server.info.uri);
    });
  }
});
