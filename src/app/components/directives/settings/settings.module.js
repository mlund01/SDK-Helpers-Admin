angular.module('orderCloud.settings', [])
    .controller('settingsCtrl', settingsController)
    .directive('settings', SettingsDirective);

function settingsController($scope) {
    var vm = this;
    vm.product = $scope.product;
    vm.action = $scope.action;
}


function SettingsDirective() {
    return {
        restrict: 'E',
        scope: {
            product: '=product',
            action: '='
        },
        controller: 'settingsCtrl',
        controllerAs: 'Settings',
        templateUrl: 'components/directives/settings/settings.tpl.html'
    }
}