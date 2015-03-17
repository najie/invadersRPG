/**
 * Created by najie on 17/03/15.
 */
function Lasers() {
    this.init = function(game) {
        this.game = game;
    };
    this.create = function() {
        this.lasers = this.game.add.group();
        this.lasers.enableBody = true;
        this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
        this.lasers.createMultiple(50, 'laser-1');
        this.lasers.setAll('anchor.x', 0.5);
        this.lasers.setAll('anchor.y', 0.5);
    };
    this.update = function() {

    };
}
