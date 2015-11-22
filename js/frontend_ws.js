var ALLOW_TEXT_MESSAGE_INPUT = true;
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
    var message = data.message.trim();
    var fromNumber = data.from;
    var timeStamp = messageEvent.timeStamp;
    var time = new Date(timeStamp);
    var isCmd = '';

    if (ALLOW_TEXT_MESSAGE_INPUT && GAME_STATE_SCOPE) {
      isCmd = 'cmd';
      if (isThrustInput(message)) {
        GAME_STATE_SCOPE.accelerateShip(20);
        console.log('THRUSTING');
      } else if (isLeftInput(message)) {
        GAME_STATE_SCOPE.rotateShipLeft(30);
        console.log('L ROTATE');
      } else if (isRightInput(message)) {
        GAME_STATE_SCOPE.rotateShipRight(30);
        console.log('R ROTATE');
      } else if (isFireInput(message)) {
        GAME_STATE_SCOPE.fire();
        console.log('FIRE');
      } else {
       // do nothing
       isCmd = '';
      }
    }

    // add the message to the box
    document.getElementById('messages').innerHTML +=
      '<span class="' + isCmd + '"><i class="em em-telephone_receiver"></i>' + time.toLocaleTimeString()
      + '&nbsp;:&nbsp;' + fromNumber + ' said "' + message + '"</span></br>';

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

function isThrustInput(m) {
  return (m === 'u' ||
          m === 'U' ||
          m === 't' ||
          m === 'T' ||
          m === '🚀' ||
          m === '🔼' ||
          m === '⬆️');
}

function isLeftInput(m) {
  return (m === 'l' ||
          m === 'L' ||
          m === '◀️' ||
          m === '⬅️');
}

function isRightInput(m) {
  return (m === 'r' ||
          m === 'R' ||
          m === '▶️' ||
          m === '➡️');
}

function isFireInput(m) {
  return (m === 'f' ||
          m === 'F' ||
          m === 's' ||
          m === 'S' ||
          m === '🔫' ||
          m === '💣');
}
