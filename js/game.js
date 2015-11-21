var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

var graphicAssets = {
  ship: {
    URL: 'assets/ship.png',
    name: 'ship'
  },
  bullet: {
    URL: 'assets/bullet.png',
    name: 'bullet'
  },
  asteroidLarge: {
    URL: 'assets/asteroidLarge.png',
    name: 'asteroidLarge'
  },
  asteroidMedium: {
    URL: 'assets/asteroidMedium.png',
    name: 'asteroidMedium'
  },
  asteroidSmall: {
    URL: 'assets/asteroidSmall.png',
    name: 'asteroidSmall'
  }
};

var shipProperties = {
  startX: gameProperties.screenWidth  * 1.0/2,
  startY: gameProperties.screenHeight * 1.0/2
};

var gameState = function(game){
  this.shipSprite;
};

gameState.prototype = {
    
    preload: function () {
      for (var key in graphicAssets) {
        game.load.image(graphicAssets[key].name, graphicAssets[key].URL);
      }
    },
    
    create: function () {
      this.initGraphics();
    },

    update: function () {
    },

    initGraphics: function() {
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      this.shipSprite.angle = -90;
      this.shipSprite.anchor.set(0.5, 0.5);
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
