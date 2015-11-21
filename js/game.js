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
  startY: gameProperties.screenHeight * 1.0/2,
  acceleration: 300,
  drag: 100,
  maxVelocity: 300,
  angularVelocity: 200
};

var gameState = function(game){
  this.shipSprite;

  this.key_left;
  this.key_right;
  this.key_thrust;
};

gameState.prototype = {
    
    preload: function () {
      for (var key in graphicAssets) {
        game.load.image(graphicAssets[key].name, graphicAssets[key].URL);
      }
    },
    
    create: function () {
      this.initGraphics();
      this.initPhysics();
      this.initKeyboard();
    },

    update: function () {
      this.checkPlayerInput();
    },

    initGraphics: function() {
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      this.shipSprite.angle = -90;
      this.shipSprite.anchor.set(0.5, 0.5);
    },
    initPhysics: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
      this.shipSprite.body.drag.set(shipProperties.drag);
      this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
    },
    initKeyboard: function() {
      this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      //wildhacks15 promo code
    },
    checkPlayerInput: function() {
      if (this.key_left.isDown) {
        this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
      } else if (this.key_right.isDown) {
        this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
      } else {
        this.shipSprite.body.angularVelocity = 0;
      }

      if (this.key_thrust.isDown) {
        game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation,
            shipProperties.acceleration, this.shipSprite.body.acceleration);
      } else {
        this.shipSprite.body.acceleration.set(0);
      }
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
