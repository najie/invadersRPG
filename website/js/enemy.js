/**
 * Created by najie on 17/03/15.
 */
function Enemy(game, camera, ship, lasers, scope) {
    this.ENEMY_NEXT_SPAWN = 100;
    this.ENEMY_SPAWN_INTERVAL = 200;

    this.game = game;
    this.camera = camera;
    this.ship = ship;
    this.lasers = lasers;
    this.scope = scope;

    this.enemies = [
        {
            name: 'missile',
            damage: 1,
            health: 1,
            spriteName: 'enemy-1',
            nb: 50
        },
        {
            name: 'boss-1',
            damage: 100,
            health: 100,
            spriteName: 'boss-1',
            nb: 1,
            lasers: [
                {
                    spriteName: 'laser-ball',
                    damage: 20,
                    speed: 100,
                    nb: 2
                },
                {
                    spriteName: 'laser-ray',
                    damage: 5,
                    speed: 250,
                    nb: 20
                }
            ]
        }
    ];

    this.create = function() {
        var _self = this;
        this.enemies.forEach(function(enemy, index) {
            enemy.spriteGroup = _self.game.add.group();
            enemy.spriteGroup.enableBody = true;
            enemy.spriteGroup.physicsBodyType = Phaser.Physics.ARCADE;
            for (var i = 0; i < enemy.nb; i++) {
                var sprite = _self.game.add.sprite(0, 0, enemy.spriteName);
                sprite.anchor.set(0.5);
                sprite.exists = false;
                sprite.health = enemy.health;
                console.log(sprite);
                enemy.spriteGroup.add(sprite);
            }
        });

    };
    this.update = function() {
        if(this.game.time.now > this.ENEMY_NEXT_SPAWN) {
            this.spawn();
        }
    };
    this.spawn = function() {
        var _self = this;
        if(this.scope.health < 100) {
            var enemy = this.enemies[0].spriteGroup.getFirstExists(false);
            if(enemy) {
                var spawnZones = ['top', 'left', 'right', 'bottom'];
                var spawnZone = spawnZones[rand(0, 3)],
                    spawnX = 0,
                    spawnY;
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
                
                enemy.reset(spawnX, spawnY, enemy.health);
                enemy.speed = rand(50, 200);
                enemy.update = function() {
                    this.rotation = _self.game.physics.arcade.angleBetween(this, _self.ship);
                    this.body.maxVelocity.set(100);

                    _self.game.physics.arcade.accelerationFromRotation(this.rotation, 1000, this.body.acceleration);
                };
            }
            this.ENEMY_NEXT_SPAWN = this.game.time.now + this.ENEMY_SPAWN_INTERVAL;
        }
        else {
            var enemy = this.enemies[1].spriteGroup.getFirstExists(false);
            if(enemy) {
                enemy.reset(this.camera.x, this.camera.y - 200, enemy.health);
                enemy.update = function() {
                    this.rotation = _self.game.physics.arcade.angleBetween(this, _self.ship);
                    _self.game.physics.arcade.moveToObject(enemy, _self.ship, 100);
                }
            }
        }

    }
}