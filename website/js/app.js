/**
 * Created by najie on 14/03/15.
 */
var app = angular.module('invadersApp', [
    'ui.router',

    'invaders'
]);
angular.module("invaders", []);

var invaders = angular.module("invaders");

app.run(['$rootScope',
    function($rootScope){

    }
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('menu', {
            url: '',
            templateUrl: 'website/partials/menu.html'
        })
        .state('game', {
            url: '/game',
            templateUrl: 'website/partials/game.html'
        });
});