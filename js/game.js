var gameProperties = {
  screenWidth: 1280,
  screenHeight: 800,
};

var states = {
  game: "game",
};

var graphicAssets = {
  background: {
    URL: 'assets/background.png',
    name: 'background'
  },
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

/* PROPERTIES */
var backgroundProperties  = {
  startX: gameProperties.screenWidth  * 1.0/2,
  startY: gameProperties.screenHeight * 1.0/2,
};

var shipProperties = {
  startX: gameProperties.screenWidth  * 1.0/2,
  startY: gameProperties.screenHeight * 1.0/2,
  acceleration: 300,
  drag: 100,
  maxVelocity: 300,
  angularVelocity: 200,
  startingLives: 1, //3,
  timeToReset: 3, // invuln time
};

var bulletProperties = {
  speed: 400,
  interval: 250,
  lifeSpan: 2000,
  maxCount:30,
};

var asteroidProperties = {
  startingAsteroids: 4,
  maxAsteroids: 20,
  incrementAsteroids: 2,

  asteroidLarge: {
    minVelocity: 50,
    maxVelocity: 150,
    minAngularVelocity: 0,
    maxAngularVelocity: 200,
    score: 20,
    nextSize: graphicAssets.asteroidMedium.name,
    pieces: 2
  },
  asteroidMedium: {
    minVelocity: 50,
    maxVelocity: 200,
    minAngularVelocity: 0,
    maxAngularVelocity: 200,
    score: 50,
    nextSize: graphicAssets.asteroidSmall.name,
    pieces: 2
  },
  asteroidSmall: {
    minVelocity: 50,
    maxVelocity: 300,
    minAngularVelocity: 0,
    maxAngularVelocity: 200,
    score: 100
  }
};

var fontAssets = {
  counterFontStyle: {
    font: '20px monospace',
    fill: '#FFFFFF',
    align: 'center'
  },
  endScreenFontStyle: {
    font: '70px monospace',
    fill: '#FFFFFF',
    align: 'center'
  }
};

/* GAME STATE */
var gameState = function(game){
  this.background;
  this.shipSprite;
  this.enableFiring; //Set to enable/!disable firing (used when alive/!dead)

  this.key_left;
  this.key_right;
  this.key_thrust;
  this.key_fire;
  this.key_pause;

  this.gameFinished = false;

  this.bulletGroup;
  this.bulletInterval = 0;

  this.asteroidGroup;
  this.asteroidsCount = asteroidProperties.startingAsteroids;

  this.shipLives = shipProperties.startingLives;
  this.tf_lives;

  this.tf_gameOver;
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
    this.resetAsteroids();
    this.pauseGame(); //Pause game at startup.
  },

  update: function () {
    this.checkPlayerInput();
    this.checkBoundaries(this.shipSprite);
    this.bulletGroup.forEachExists(this.checkBoundaries, this);
    this.asteroidGroup.forEachExists(this.checkBoundaries, this);

    // check for collisions
    game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
    game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);

    if (this.asteroidGroup.countLiving() == 0)
      this.winGame();

  },

  initGraphics: function() {
    this.background = game.add.sprite(backgroundProperties.startX, backgroundProperties.startY, graphicAssets.background.name);

    this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
    this.shipSprite.angle = -90;
    this.shipSprite.anchor.set(0.5, 0.5);

    this.bulletGroup = game.add.group();

    this.asteroidGroup = game.add.group();

    this.tf_lives = game.add.text(20, 20, shipProperties.startingLives, fontAssets.counterFontStyle);
  },
  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
    this.shipSprite.body.drag.set(shipProperties.drag);
    this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

    this.bulletGroup.enableBody = true;
    this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.bulletGroup.createMultiple(30, graphicAssets.bullet.name);
    this.bulletGroup.setAll('anchor.x', 0.5);
    this.bulletGroup.setAll('anchor.y', 0.5);
    this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);
    this.enableFiring = true;

    this.asteroidGroup.enableBody = true;
    this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
  },
  pauseGame: function(){
    this.game.physics.arcade.isPaused = true;
  },
  togglePause: function() {
    this.game.physics.arcade.isPaused = !this.game.physics.arcade.isPaused;
  },
  initKeyboard: function() {
    this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.key_pause = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.key_pause.onDown.add(this.togglePause, this);
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

    if (this.key_fire.isDown) {
      this.fire();
    }
  },
  checkBoundaries: function (sprite) {
    if (sprite.x < 0) {
      sprite.x = game.width;
    } else if (sprite.x > game.width) {
      sprite.x = 0;
    } 

    if (sprite.y < 0) {
      sprite.y = game.height;
    } else if (sprite.y > game.height) {
      sprite.y = 0;
    }
  },
  fire: function () {
    if (game.time.now > this.bulletInterval && this.enableFiring && !this.game.physics.arcade.isPaused) {
      var bullet = this.bulletGroup.getFirstExists(false);

      if (bullet) {
        var length = this.shipSprite.width * 0.5;
        var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
        var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);

        bullet.reset(x, y);
        bullet.lifespan = bulletProperties.lifeSpan;
        bullet.rotation = this.shipSprite.rotation;

        game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
        this.bulletInterval = game.time.now + bulletProperties.interval;
      }
    }
  },
  createAsteroid: function(x, y, size, pieces) {
    if (pieces === undefined) {
      pieces = 1;
    }

    for (var i = 0; i < pieces; i++) {
      var asteroid = this.asteroidGroup.create(x, y, size);
      asteroid.anchor.set(0.5, 0.5);
      asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity,
          asteroidProperties[size].maxVelocity);

      var randomAngle = game.math.degToRad(game.rnd.angle());
      var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity,
          asteroidProperties[size].maxVelocity);
      game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
    }
  },
  resetAsteroids: function() {
    for (var i = 0; i < this.asteroidsCount; i++) {
      var side = Math.round(Math.random());
      var x, y;

      if (side) {
        x = Math.round(Math.random()) * gameProperties.screenWidth;
        y = Math.random() * gameProperties.screenHeight;
      } else {
        x = Math.random() * gameProperties.screenWidth;
        y = Math.round(Math.random()) * gameProperties.screenHeight;
      }

      this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
    }
  },
  asteroidCollision: function(target, asteroid) {
    target.kill();
    asteroid.kill();

    if (target.key === graphicAssets.ship.name) {
      this.destroyShip();
    }
    //Don't split if game is over (fixes bug of floating garbage)
    if (this.shipLives > 0)
      this.splitAsteroid(asteroid);
  },
  destroyShip: function() {
    this.shipLives -= 1;
    this.tf_lives.text = this.shipLives.toString();

    //Block firing.
    this.enableFiring = false;

    if (this.shipLives > 0) {
      game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
    } else {
      //End Game
      this.loseGame();
    }

  },
  resetShip: function() {
    this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
    this.shipSprite.angle = -90;
    this.enableFiring = true;
  },
  splitAsteroid: function(asteroid) {
    if (asteroidProperties[asteroid.key].nextSize) {
      this.createAsteroid(asteroid.x, asteroid.y,
          asteroidProperties[asteroid.key].nextSize,
          asteroidProperties[asteroid.key].pieces);
    }
  },
  winGame: function() {

    //Don't allow winning after losing (since we remove all the asteroids on finish).
    if (!this.gameFinished) {
      //TODO: Fix allignment of end text.
      this.tf_gameOver = game.add.text(gameProperties.screenWidth/2, gameProperties.screenHeight/2, "Congrats! Game Over.", fontAssets.endScreenFontStyle);   
      this.endGame();
    }
  },
  loseGame: function() {
    //TODO: Fix allignment of end text.
    this.tf_gameOver = game.add.text(gameProperties.screenWidth/2, gameProperties.screenHeight/2, "YOU LOSE Game Over!", fontAssets.endScreenFontStyle);   
    this.endGame();
  },
  endGame: function() {
    this.tf_lives.kill(); //Get rid of the life counter.
    this.bulletGroup.forEachAlive(this.killSprite, this);
    this.asteroidGroup.forEachAlive(this.killSprite, this);
    this.gameFinished = true;
  },
  killSprite: function(sprite) {
    sprite.kill();
  }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
