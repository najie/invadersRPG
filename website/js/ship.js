/**
 * Created by najie on 17/03/15.
 */
function Ship() {
    this.LASER_TIME = 0;

    this.init = function(game, scope, cursors, lasers) {
        this.game = game;
        this.scope = scope;
        this.cursors = cursors;
        this.lasers = lasers;
    };

    this.create = function() {
        this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');

        this.ship.frame = 2;
        this.ship.anchor.set(0.5);
        this.ship.angle = -90;
        this.ship.health = this.scope.health;
        this.ship.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.body.collideWorldBounds = true;
        this.ship.body.drag.set(400);
        this.ship.body.maxVelocity.set(200);

        /*this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
        this.emitter.makeParticles('fire-1');
        this.emitter.setAlpha(1, 0, 500);
        this.emitter.gravity = 0;
        this.emitter.start(false, 300, 10);
        this.emitter.setXSpeed(0, 0);
        this.emitter.setYSpeed(0, 0);*/
    };

    this.update = function() {
        this.ship.bringToTop();

        /*this.emitter.emitX = this.ship.x;
        this.emitter.emitY = this.ship.y;*/

        if(this.cursors.up.isDown) {
            this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 1000, this.ship.body.acceleration);
            //this.emitter.on = true;
            this.ship.frame = 1;
        }
        else {
            this.ship.frame = 2;
            //this.emitter.on = false;
            this.ship.body.acceleration.set(0);
        }
        if(this.cursors.down.isDown) {
            this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, -150, this.ship.body.acceleration);
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
    };

    this.fire = function() {
        if (this.game.time.now > this.LASER_TIME) {
            var laser = this.lasers.getFirstExists(false);
            if (laser) {
                laser.reset(this.ship.x, this.ship.y);
                laser.lifespan = 3000;
                laser.rotation = this.ship.rotation;
                this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 400, laser.body.velocity);
                this.LASER_TIME= this.game.time.now + 80;
            }
        }
    }

}