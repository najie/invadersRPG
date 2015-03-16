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
            this.lasers.createMultiple(50, 'laser-1');
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
            var _self = this;
            //Bring ship to top to make laser fire from under the ship
            this.ship.bringToTop();

            //Collision between lasers and enemies
            this.game.physics.arcade.overlap(this.lasers, this.enemies, this.laserHitEnemy, null, this);

            //INPUTS
            if(this.cursors.up.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
            }
            else {
                this.ship.body.acceleration.set(0);
            }
            if(this.cursors.down.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, -200, this.ship.body.acceleration);
            }
            if (this.cursors.left.isDown) {
                this.ship.body.angularVelocity = -300;
            }
            else if (this.cursors.right.isDown) {
                this.ship.body.angularVelocity = 300;
            }
            else {
                this.ship.body.angularVelocity = 0;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.fire();
            }

            //Enemies Spawn
            if(this.game.time.now > this.enemyTime) {
                console.log('pop');
                var enemy = this.enemies.getFirstExists(false);
                var spawnZones = ['top', 'left', 'right', 'bottom'];
                if(enemy) {
                    var spawnZone = spawnZones[rand(0, 3)],
                        spawnX = 0,
                        spawnY;

                    spawnZone = 'top';
                    switch(spawnZone) {
                        case 'top':
                            spawnX = rand(this.camera.x, this.camera.x+this.game.width);
                            spawnY = rand(this.camera.y+20, this.camera.y+50);
                            break;
                        case 'left':
                            break;
                        case 'right':
                            break;
                        case 'bottom':
                            break;
                    }
                    enemy.reset(spawnX, spawnY);
                    enemy.speed = rand(50, 200);
                    enemy.update = function() {
                        this.rotation = _self.game.physics.arcade.angleBetween(this, _self.ship);
                        this.body.velocity.x = Math.cos(this.rotation) * this.speed;
                        this.body.velocity.y = Math.sin(this.rotation) * this.speed;

                    };
                }
                this.enemyTime = this.game.time.now + 1000;
            }

        },
        render: function() {
            //var zone = this.game.camera.deadzone;
            //this.game.debug.geom(zone, "#FFF", "#FFF");
        },
        fire: function() {
            if (this.game.time.now > this.laserTime)
            {
                var laser = this.lasers.getFirstExists(false);
                if (laser)
                {
                    laser.reset(this.ship.body.x + 16, this.ship.body.y + 16);
                    laser.lifespan = 3000;
                    laser.rotation = this.ship.rotation;
                    this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 400, laser.body.velocity);
                    this.laserTime= this.game.time.now + 80;
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
