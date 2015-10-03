var express    = require('express'),
    fs         = require('fs'),
    http       = require('http'),
    //https      = require('https'),
    peer       = require('peer').ExpressPeerServer,
    config     = require('./config/config'),
    connection = require('./manager/connection');

var privateKey  = fs.readFileSync('./ssl/server.key', 'utf8'),
    certificate = fs.readFileSync('./ssl/server.crt', 'utf8'),
    credentials = { key: privateKey, cert: certificate };

var app = express(),
    server = http.createServer(app),
    //server = https.createServer(credentials, app),
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
