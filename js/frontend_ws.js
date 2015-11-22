(function() {
  var WS = window.WebSocket || window.MozWebSocket;

  if (!WS) {
    window.alert('NEED WEB SOCKETS!');
    return;
  }

  var numbersHash = {};
  var uniqueNumberCount = 0;
  var connection = new WS('ws://127.0.0.1:3000');

  connection.onopen = function() {
    connection.send('frontend is open!');
    document.getElementById('conC').style.display = 'none';
    document.getElementById('conO').style.display = 'inherit';
  };

  connection.onerror = function(error) {
    console.log('ERROR! ERROR! ERROR!');
    console.log(error);
  }

  connection.onmessage = function(messageEvent) {
    var data   = messageEvent.data;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    var message = data.message;
    var fromNumber = data.from;
    var timeStamp = messageEvent.timeStamp;
    var time = new Date(timeStamp);

    // add the message to the box
    document.getElementById('messages').innerHTML +=
      '<i class="em em-telephone-receiver"></i>' + time.toLocaleTimeString()
      + '&nbsp;:&nbsp;' + fromNumber + ' said "' + message + '"</br>';

    // check for unique numbers
    if (!numbersHash.hasOwnProperty(fromNumber)) {
      numbersHash[fromNumber] = timeStamp;
      uniqueNumberCount += 1;
      console.log('Seen %d numbers', uniqueNumberCount);
      var uniqCtr = document.getElementById('uniqCtr');
      uniqCtr.innerHTML = uniqueNumberCount.toString();
    }
  };
})();
