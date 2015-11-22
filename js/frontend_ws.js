console.log('outside');
(function() {
  console.log('inside');
  var WS = window.WebSocket || window.MozWebSocket;

  if (!WS) {
    window.alert('NEED WEB SOCKETS!');
  }

  var connection = new WS('ws://127.0.0.1:3000');
  console.log(connection);

  connection.onopen = function() {
    connection.send('frontend is open!');
    console.log('open!');
  };

  connection.onerror = function(error) {
    console.log(error);
  }

  connection.onmessage = function(messageEvent) {
    console.log(messageEvent);
    //console.log('MESSAGE: %s', message);
  };
  console.log('done inside');
})();
console.log('done outside');
