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
  console.log('RECEIVED: %s', message);
};

var connection = function(ws) {
  var loc = url.parse(ws.upgradeReq.url, true);

  ws.on('message', incoming);

  // what is sent to the front-end
  //ws.send('something!');

  app.get('/message', function(req, res) {
    //res.send('<Response><Message>Thanks for letting us know.</Message></Response>');
    res.send(textMessageResponse);
    //console.log(req);
    var textMessageData = req.query.Body;
    var texterNumber    = req.query.From;
    if (textMessageData) {
      console.log(textMessageData);
      if (ws && ws.send) {
        //ws.send(textMessageData);
        ws.send(JSON.stringify({
          message:  textMessageData,
          from:     texterNumber
        }));
      }
    }
    //ws.send(req.query.Body);
  });
};

/*
app.get('/message', function(req, res) {
  res.send('<Response><Message>Thanks for letting us know.</Message></Response>');
  if (req.query.Body) {
    console.log(req.query.Body);
    /*
    if (ws && ws.send) {
      ws.send(req.query.Body); // send to the client, hopefully
    }
    *-/
  }
});
*/

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
