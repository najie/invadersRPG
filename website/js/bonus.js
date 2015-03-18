/**
 * Created by jeremylaurain on 18/03/15.
 */
function Bonus(scope, game, ship) {

    this.game = game;
    this.ship = ship;

    this.bonus = [
        {
            name: 'health',
            value: 1,
            spriteName: 'bonusHealth'
        }
    ];

    this.create = function() {
        var _self = this;
        this.bonus.forEach(function(bonus, index) {
            bonus.spriteGroup = _self.game.add.group();
            bonus.spriteGroup.enableBody = true;
            bonus.spriteGroup.physicsBodyType = Phaser.Physics.ARCADE;
            for (var i = 0; i < 10; i++) {
                var hBonus = _self.game.add.sprite(0,0, bonus.spriteName);
                hBonus.name = 'hBonus';
                hBonus.exists = false;
                hBonus.maxVelocity = 100;
                bonus.spriteGroup.add(hBonus);
            }
        });

    };

    this.update = function() {
        var _self = this;
        this.bonus.forEach(function(bonus, index) {
            _self.game.physics.arcade.overlap(_self.ship, bonus.spriteGroup, _self.bonusHitShip, null, this);
        });
    };

    this.bonusHitShip = function(ship, bonus) {
        switch(bonus.name) {
            case 'hBonus':
                scope.health += 1;
                scope.$apply();
                break;
        }
        bonus.kill();
    };

}