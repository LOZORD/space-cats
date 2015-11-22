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

var textMessageResponse =
  '<Response><Message>Thanks for letting us know.</Message></Response>';

var incoming = function(message) {
  console.log('received: %s', message);
};

//app.get('/message', replyToTextAndRespondToFrontEndWithSocket(null));

var connection = function(ws) {
  var loc = url.parse(ws.upgradeReq.url, true);

  ws.on('message', incoming);

  //replyToTextAndRespondToFrontEndWithSocket(ws);

  // what is sent to the front-end
  ws.send('something!');

  app.get('/message', function(req, res) {
    //res.send('<Response><Message>Thanks for letting us know.</Message></Response>');
    /*
    res.send(textMessageResponse);
    if (req.query.Body) {
      console.log(req.query.Body);
      if (ws && ws.send) {
        ws.send(req.query.Body); // send to the client, hopefully
      }
    }
    */
    ws.send(req.query.Body);
  });
};

app.get('/message', function(req, res) {
  res.send('<Response><Message>Thanks for letting us know.</Message></Response>');
  if (req.query.Body) {
    console.log(req.query.Body);
    /*
    if (ws && ws.send) {
      ws.send(req.query.Body); // send to the client, hopefully
    }
    */
  }
});

function replyToTextAndRespondToFrontEndWithSocket(ws) {
  return function(req, res) {
    // respond to the texter
    res.send(textMessageResponse);
    var messageData = req.query && req.query.Body;
    if (messageData) {
      console.log(messageData);
      if (ws && ws.send) {
        ws.send(messageData);
      }
    }
  };
}

wss.on('connection', connection);

server.on('request', app);
server.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('SPACE CATS listening at host: %s, port: %s', host, port);
});
