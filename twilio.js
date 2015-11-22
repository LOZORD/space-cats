/*
var client = require('twilio')('A_SID', 'A_TKN');
var express = require('express');

var app = express();

app.get('/message', function(req, res) {
  res.send('<Response><Message>Thanks for letting us know.</Message></Response>');
  console.log(req.query.Body);
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('space-cats listening at host ', host, 'port ', port);
});

//var WebSocket = require('ws');
//var ws = new WebSocket('ws://
*/

var server            = require('http').createServer(),
    url               = require('url'),
    WebSocketServer   = require('ws').Server,
    wss               = new WebSocketServer({ server: server }),
    express           = require('express'),
    app               = express(),
    port              = 3000;

app.get('/message', function(req, res) {
  res.send('<Response><Message>Thanks for letting us know.</Message></Response>');
  if (req.query.Body) {
    console.log(req.query.Body);
  }
});

var incoming = function(message) {
  console.log('received: %s', message);
};

var connection = function(ws) {
  var loc = url.parse(ws.upgradeReq.url, true);

  ws.on('message', incoming);

  ws.send('something!');
};

wss.on('connection', connection);

server.on('request', app);
server.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('SPACE CATS listening at host: %s, port: %s', host, port);
});
