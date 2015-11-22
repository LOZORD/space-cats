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
