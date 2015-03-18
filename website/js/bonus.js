/**
 * Created by jeremylaurain on 18/03/15.
 */
function Bonus(game) {

    this.game = game;

    this.bonus = [
        {
            name: 'health',
            value: 5,
            spriteName: 'healthBonus'
        }
    ];

    this.create = function() {
        var _self = this;
        this.bonus.forEach(function(bonus, index) {
            bonus.sprite = _self.game.add.sprite(0, 0, bonus.spriteName);
        });

    };

    this.update = function() {

    }

}