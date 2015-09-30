var express    = require('express'),
    http       = require('http'),
    peer       = require('peer').ExpressPeerServer,
    config     = require('./config/config'),
    connection = require('./manager/connection');

var app = express(),
    server = http.createServer(app),
    port =  parseInt(process.env.PORT, 10) || config.server.port,
    io;

// static files
app.use(express.static(__dirname + '/../public'));

// webRTC server
app.use('/peer', peer(server, {debug: true}));

// routing
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

// socket.io
io = require('socket.io')(server);
connection.init(io);

server.listen(port, function() {
  console.log('Server started at: http://' + config.server.host + ':' + config.server.port);
});
