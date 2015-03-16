/**
 * Created by najie on 14/03/15.
 */
var GameStates = {
    menuState : {
        preload: function() {
            this.game.load.image('menuBg', 'website/assets/images/bg.jpg');
            this.game.load.bitmapFont('Test', 'website/assets/fonts/test/font.png', 'website/assets/fonts/test/font.fnt');
        },
        create: function() {
            var world = this.game.world;
            var bg = this.game.add.tileSprite(0, 0, world.width, world.height, 'menuBg');
            bg.autoScroll(-30, -20);

            var play = this.game.add.bitmapText(world.centerX, 150, 'Test','Play', 64);
            play.align = 'center';
            play.x = world.width / 2 - play.textWidth / 2;
            play.inputEnabled = true;

            play.events.onInputDown.add(function() {
                this.game.state.start('Game');
            }, this);
        }
    },
    gameState: {
        laserTime: 0,
        enemyTime: 1000,

        preload: function() {
            this.game.load.image('gameBg', 'website/assets/images/deep-space.jpg');
            this.game.load.image('laser-1', 'website/assets/images/fire-1.png');
            this.game.load.spritesheet('ship', 'website/assets/images/ship-2.png', 32, 32, 6);
            this.game.load.image('enemy-1', 'website/assets/images/enemy-2.png');
        },
        create: function() {
            var world = this.game.world;
            this.game.world.setBounds(0, 0, 6000, 6000);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.bg = this.game.add.tileSprite(0, 0, world.width, world.height, 'gameBg');

            this.ship = this.game.add.sprite(2500, 2500, 'ship');
            this.ship.frame = 5;
            this.ship.anchor.set(0.5);
            this.ship.angle = -90;

            this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
            this.game.camera.follow(this.ship);
            this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 200);

            this.ship.body.collideWorldBounds = true;
            this.ship.body.drag.set(200);
            this.ship.body.maxVelocity.set(200);

            this.lasers = this.game.add.group();
            this.lasers.enableBody = true;
            this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
            this.lasers.createMultiple(40, 'laser-1');
            this.lasers.setAll('anchor.x', 0.5);
            this.lasers.setAll('anchor.y', 0.5);

            /*for (var i = 0; i < 20; i++) {
                var laser = this.lasers.create(0, 0, 'laser-1');
                laser.name = 'laser-'+i;
                laser.exists = false;
                laser.visible = false;
                laser.checkWorldBounds = true;
                laser.events.onOutOfBounds.add(this.resetLaser, this);
            }*/

            this.enemies = this.game.add.group();
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemies.createMultiple(100, 'enemy-1');
            this.enemies.setAll('anchor.x', 0.5);
            this.enemies.setAll('anchor.y', 0.5);

            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        },
        update: function() {
            this.ship.bringToTop();

            this.game.physics.arcade.overlap(this.lasers, this.enemies, this.laserHitEnemy, null, this);

            if(this.cursors.up.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
            }
            else {
                this.ship.body.acceleration.set(0);
            }
            if (this.cursors.left.isDown)
            {
                this.ship.body.angularVelocity = -300;
            }
            else if (this.cursors.right.isDown)
            {
                this.ship.body.angularVelocity = 300;
            }
            else
            {
                this.ship.body.angularVelocity = 0;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            {
                console.log('fire');
                this.fire();
            }

            //Display Enemies
            if(this.game.time.now > this.enemyTime) {
                console.log('pop');
                var enemy = this.enemies.getFirstExists(false);
                if(enemy) {
                    enemy.reset(this.ship.body.x + 100, this.ship.body.y + 100);
                }
                this.enemyTime = this.game.time.now + 3000;
            }

        },
        render: function() {

            var zone = this.game.camera.deadzone;
            //this.game.debug.geom(zone, "#FFF", "#FFF");
        },
        fire: function() {
            if (this.game.time.now > this.laserTime)
            {
                var laser = this.lasers.getFirstExists(false);
                if (laser)
                {
                    laser.reset(this.ship.body.x + 16, this.ship.body.y + 16);
                    laser.lifespan = 1000;
                    laser.rotation = this.ship.rotation;
                    this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 400, laser.body.velocity);
                    this.laserTime= this.game.time.now + 100;
                }
            }
        },
        resetLaser: function(laser) {
            laser.kill();
        },
        laserHitEnemy: function(laser, enemy) {
            enemy.kill();
        }
    }
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
