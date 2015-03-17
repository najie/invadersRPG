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
        scope: {},

        preload: function() {
            this.game.load.image('gameBg', 'website/assets/images/deep-space.jpg');
            this.game.load.image('laser-1', 'website/assets/images/fire-1.png');
            this.game.load.image('fire-1', 'website/assets/images/fire-ship-2.png');
            this.game.load.image('enemy-1', 'website/assets/images/enemy-2.png');

            this.game.load.spritesheet('ship', 'website/assets/images/ship-2.png', 32, 32, 6);
            this.game.load.spritesheet('boom-1', 'website/assets/images/boom-64.png', 64, 64, 10);
        },
        create: function() {
            var world = this.game.world;
            this.game.world.setBounds(0, 0, 6000, 6000);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.bg = this.game.add.tileSprite(0, 0, world.width, world.height, 'gameBg');

            this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
            this.ship.frame = 5;
            this.ship.anchor.set(0.5);
            this.ship.angle = -90;
            this.ship.health = this.scope.health;
            this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
            this.ship.body.collideWorldBounds = true;
            this.ship.body.drag.set(400);
            this.ship.body.maxVelocity.set(200);

            this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
            this.emitter.makeParticles('fire-1');
            this.emitter.setAlpha(1, 0, 300);
            this.emitter.gravity = 0;
            this.emitter.start(false, 300, 10);
            this.emitter.setXSpeed(0, 0);
            this.emitter.setYSpeed(0, 0);

            this.cameraPos = new Phaser.Point(0, 0);
            this.cameraPos.setTo(this.ship.x, this.ship.y);

            this.lasers = this.game.add.group();
            this.lasers.enableBody = true;
            this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
            this.lasers.createMultiple(50, 'laser-1');
            this.lasers.setAll('anchor.x', 0.5);
            this.lasers.setAll('anchor.y', 0.5);

            this.enemies = this.game.add.group();
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemies.createMultiple(100, 'enemy-1');
            this.enemies.setAll('anchor.x', 0.5);
            this.enemies.setAll('anchor.y', 0.5);

            this.booms = this.game.add.group();
            for (var i = 0; i < 10; i++) {
                var boom = this.game.add.sprite(2500, 2550, 'boom-1');
                boom.animations.add('boom');

                this.booms.add(boom);
            }

            this.booms.callAll('animations.play', 'animations', 'boom');

            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        },
        update: function() {
            var _self = this;
            //Bring ship to top to make laser fire from under the ship
            this.ship.bringToTop();

            //Collisions
            this.game.physics.arcade.overlap(this.lasers, this.enemies, this.laserHitEnemy, null, this);
            this.game.physics.arcade.overlap(this.emitter, this.enemies, this.laserHitEnemy, null, this);
            this.game.physics.arcade.overlap(this.ship, this.enemies, this.shipHitEnemy, null, this);

            //Ship Fire
            this.emitter.emitX = this.ship.x;
            this.emitter.emitY = this.ship.y;

            //Camera
            var lerp = 0.07;
            this.cameraPos.x += (this.ship.x - this.cameraPos.x) * lerp;
            this.cameraPos.y += (this.ship.y - this.cameraPos.y) * lerp;
            this.game.camera.focusOnXY(this.cameraPos.x, this.cameraPos.y);


            //INPUTS
            if(this.cursors.up.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 1000, this.ship.body.acceleration);
                this.emitter.on = true;
            }
            else {
                this.emitter.on = false;
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
                this.spawn();
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
                if (laser) {
                    laser.reset(this.ship.body.x + 16, this.ship.body.y + 16);
                    laser.lifespan = 3000;
                    laser.rotation = this.ship.rotation;
                    this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 400, laser.body.velocity);
                    this.laserTime= this.game.time.now + 80;
                }
            }
        },
        laserHitEnemy: function(laser, enemy) {
            laser.kill();
            enemy.kill();
            var boom = this.booms.getFirstExists(false);
            if(boom) {
                boom.x = enemy.x;
                boom.y = enemy.y;

                boom.play('boom', 100, false, true);
            }
        },
        shipHitEnemy: function(ship, enemy) {
            ship.health -= 1;
            this.scope.health -=1;
            this.scope.$apply();
            enemy.kill();
        },
        spawn : function() {
            var _self = this;
            var enemy = this.enemies.getFirstExists(false);
            var spawnZones = ['top', 'left', 'right', 'bottom'];
            if(enemy) {
                var spawnZone = spawnZones[rand(0, 3)],
                    spawnX = 0,
                    spawnY;

                spawnZone = spawnZones[rand(0,3)];
                switch(spawnZone) {
                    case 'top':
                        spawnX = rand(this.camera.x, this.camera.x+this.game.width);
                        spawnY = this.camera.y-20;
                        break;
                    case 'left':
                        spawnX = this.camera.x - 20;
                        spawnY = rand(this.camera.y, this.camera.y + this.game.height);
                        break;
                    case 'right':
                        spawnX = this.camera.x + this.game.width + 20;
                        spawnY = rand(this.camera.y, this.camera.y + this.game.height);
                        break;
                    case 'bottom':
                        spawnX = rand(this.camera.x, this.camera.x + this.game.width);
                        spawnY = this.camera.y + this.game.height + 20;
                        break;
                }
                enemy.reset(spawnX, spawnY);
                enemy.speed = rand(50, 200);
                enemy.update = function() {
                    this.rotation = _self.game.physics.arcade.angleBetween(this, _self.ship);
                    this.body.maxVelocity.set(100);
                    _self.game.physics.arcade.accelerationFromRotation(this.rotation, 1000, this.body.acceleration);

                };
            }
            this.enemyTime = this.game.time.now + 500;
        }
    }
};
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
