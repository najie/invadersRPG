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
        enemyTime: 1000,
        scope: {},
        classes:{},

        preload: function() {
            this.game.load.image('gameBg', 'website/assets/images/deep-space.jpg');
            this.game.load.image('laser-1', 'website/assets/images/fire-1.png');
            this.game.load.image('fire-1', 'website/assets/images/fire-ship-2.png');
            this.game.load.image('enemy-1', 'website/assets/images/enemy-2.png');
            this.game.load.image('bonusHealth', 'website/assets/images/bonus-health-1.png');
            this.game.load.image('boss-1', 'website/assets/images/boss-1.png');
            //this.game.load.image('ship', 'website/assets/images/ship-3.png');

            //this.game.load.spritesheet('ship', 'website/assets/images/ship-2.png', 32, 32, 6);
            this.game.load.spritesheet('ship', 'website/assets/images/ship-4.png', 43, 39, 3);
            this.game.load.spritesheet('boom-1', 'website/assets/images/boom-64.png', 64, 64, 10);
        },
        create: function() {
            var world = this.game.world;
            this.game.world.setBounds(0, 0, 6000, 6000);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.game.add.tileSprite(0, 0, world.width, world.height, 'gameBg');

            var lasers = new Lasers();
            lasers.init(this.game);
            lasers.create();
            this.lasers = lasers.lasers;

            var ship = new Ship();
            ship.init(this.game, this.scope, this.cursors, this.lasers);
            ship.create();
            this.classes.ship = ship;
            this.ship = ship.ship;

            var bonus = new Bonus(this.scope, this.game, this.ship);
            bonus.create();
            this.bonus = bonus.bonus;
            this.classes.bonus = bonus;

            var enemies = new Enemy(this.game, this.camera, this.ship, this.lasers, this.scope);
            enemies.create();
            this.classes.enemy = enemies;
            this.enemies = enemies.enemies;

            this.booms = this.game.add.group();
            for (var i = 0; i < 2; i++) {
                var boom = this.game.add.sprite(3000, 3000, 'boom-1');
                boom.animations.add('boom');
                boom.anchor.set(0.5);

                this.booms.add(boom);
            }

            this.cameraPos = new Phaser.Point(0, 0);
            this.cameraPos.setTo(this.ship.x, this.ship.y);

        },
        update: function() {
            var _self = this;
            //Camera
            var lerp = 0.025;
            this.cameraPos.x += (this.ship.x - this.cameraPos.x) * lerp;
            this.cameraPos.y += (this.ship.y - this.cameraPos.y) * lerp;
            this.game.camera.focusOnXY(this.cameraPos.x, this.cameraPos.y);

            this.classes.ship.update();
            this.classes.enemy.update();
            this.classes.bonus.update();

            //Collisions

            this.enemies.forEach(function(enemy, index) {
                _self.game.physics.arcade.overlap(_self.lasers, enemy.spriteGroup, _self.laserHitEnemy, null, _self);
                _self.game.physics.arcade.overlap(_self.ship, enemy.spriteGroup, _self.shipHitEnemy, null, _self);
            });



        },
        render: function() {
            //var zone = this.game.camera.deadzone;
            //this.game.debug.geom(zone, "#FFF", "#FFF");
        },
        laserHitEnemy: function(laser, enemy) {
            var _self = this;

            this.bonus.forEach(function(bonus, index) {

                var drop = rand(1, 100/bonus.dropChance);

                if(drop == 1) {
                    var healthBonus = bonus.spriteGroup.getFirstExists(false);
                    if(healthBonus) {
                        healthBonus.exists = true;
                        healthBonus.x = enemy.x;
                        healthBonus.y = enemy.y;
                        healthBonus.update = function() {
                            _self.game.physics.arcade.moveToObject(this, _self.ship, bonus.speed);
                        };
                    }
                }
            });

            laser.kill();
            enemy.health--;
            if(enemy.health <= 0) {
                enemy.kill();
            }

            var boom = this.booms.getFirstAlive();
            if(boom) {
                boom.x = enemy.x;
                boom.y = enemy.y;

                boom.visible = true;
                boom.play('boom', 100, false, true);
            }
            else {
                this.booms.forEachDead(function(boom) {
                    boom.exists = true;
                    boom.alive = true;
                    boom.visible = false;
                }, this);

                boom = this.booms.getFirstAlive();
                if(boom) {
                    boom.x = enemy.x;
                    boom.y = enemy.y;

                    boom.visible = true;
                    boom.play('boom', 100, false, true);
                }
            }
        },
        shipHitEnemy: function(ship, enemy) {
            ship.health -= 1;
            this.scope.health -= 1;
            this.scope.$apply();
            enemy.kill();
        }
    }
};
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
