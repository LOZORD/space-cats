(function() {
  var WS = window.WebSocket || window.MozWebSocket;
  var numbersHash = {};
  var uniqueNumberCount = 0;

  if (!WS) {
    window.alert('NEED WEB SOCKETS!');
  }

  var connection = new WS('ws://127.0.0.1:3000');
  //console.log(connection);

  connection.onopen = function() {
    connection.send('frontend is open!');
    //console.log('open!');
  };

  connection.onerror = function(error) {
    console.log(error);
  }

  connection.onmessage = function(messageEvent) {
    //console.log(messageEvent);
    var data   = messageEvent.data;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    var message = data.message;
    var fromNumber = data.from;
    var timeStamp = messageEvent.timeStamp;
    var time = new Date(timeStamp);
    //console.log(message);
    document.getElementById('messages').innerHTML +=
      '<i class="em em-telephone-receiver"></i>' + time.toLocaleTimeString()
      + '&nbsp;:&nbsp;' + fromNumber + ' said "' + message + '"</br>';

    if (!numbersHash.hasOwnProperty(fromNumber)) {
      numbersHash[fromNumber] = timeStamp;
      uniqueNumberCount += 1;
      console.log('Seen %d numbers', uniqueNumberCount);
      var uniqCtr = document.getElementById('uniqCtr');
      uniqCtr.innerHTML = uniqueNumberCount.toString();
    }
  };
  //console.log('done inside');
})();
//console.log('done outside');
