var express    = require('express'),
    https      = require('https'),
    http       = require('http'),
    peer       = require('peer').ExpressPeerServer,
    config     = require('./config/config'),
    fs 		   = require('fs'),
    connection = require('./manager/connection');

var privateKey  = fs.readFileSync('./config/server.key', 'utf8');
var certificate = fs.readFileSync('./config/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express(),
    // server = http.createServer(app),
    server = https.createServer(credentials, app),
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
  console.log('Server started at: https://' + config.server.host + ':' + config.server.port);
});
