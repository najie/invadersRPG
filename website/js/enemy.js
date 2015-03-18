/**
 * Created by najie on 17/03/15.
 */
function Enemy(game, camera, ship) {
    this.ENEMY_NEXT_SPAWN = 100;
    this.ENEMY_SPAWN_INTERVAL = 1000;

    this.game = game;
    this.camera = camera;
    this.ship = ship;

    this.create = function() {
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.createMultiple(100, 'enemy-1');
        this.enemies.setAll('anchor.x', 0.5);
        this.enemies.setAll('anchor.y', 0.5);
    };
    this.update = function() {
        if(this.game.time.now > this.ENEMY_NEXT_SPAWN) {
            this.spawn();
        }
    };
    this.spawn = function() {
        var _self = this;
        var enemy = this.enemies.getFirstExists(false);
        var spawnZones = ['top', 'left', 'right', 'bottom'];
        if(enemy) {
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
            enemy.reset(spawnX, spawnY);
            enemy.speed = rand(50, 200);
            enemy.update = function() {
                this.rotation = _self.game.physics.arcade.angleBetween(this, _self.ship);
                this.body.maxVelocity.set(100);

                _self.game.physics.arcade.accelerationFromRotation(this.rotation, 1000, this.body.acceleration);
            };
        }
        this.ENEMY_NEXT_SPAWN = this.game.time.now + this.ENEMY_SPAWN_INTERVAL;
    }
}