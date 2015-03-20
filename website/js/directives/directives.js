/**
 * Created by najie on 14/03/15.
 */
invaders.directive("gameCanvas",function($injector) {
    return {
        scope: {
        },
        template: "<div id='game-canvas'></div>" +
        "<div class='health'>{{health}}</div>",
        link: function(scope, elem, attrs) {
            var h = parseInt($("#game-canvas").css('height'), 10);
            var w = parseInt($("#game-canvas").css('width'), 10);

            scope.game = new Phaser.Game(w, h, Phaser.AUTO, 'game-canvas');
            scope.health = 100;

            var states = GameStates;
            states.game = scope.game;
            states.gameState.scope = scope;


            scope.game.state.add('Menu', states.menuState);
            scope.game.state.add('Game', states.gameState);
            scope.game.state.start('Game');
        }
    }
});
