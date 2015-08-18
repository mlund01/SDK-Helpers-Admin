angular.module('orderCloud.chips', [])
    .controller('chipsCtrl', ChipsController)
    .directive('chips', ChipsDirective);

function ChipsController($scope, PalletSvc) {
    var vm = this;
    vm.focus = $scope.focus;
    vm.target = $scope.target;
    vm.object = $scope.object;
    vm.pallet = $scope.pallet;
    vm.PalletSvc = PalletSvc;

    if (vm.pallet) {
        vm.backColor = vm.PalletSvc.pickColor(vm.pallet);
    }

}

function ChipsDirective() {
    return {
        restrict: 'E',
        scope: {
            focus: '@',
            target: '@',
            object: '=',
            pallet: '@'
        },
        controller: 'chipsCtrl',
        controllerAs: 'chips',
        templateUrl: 'components/directives/chips/chips.tpl.html'
    }
}