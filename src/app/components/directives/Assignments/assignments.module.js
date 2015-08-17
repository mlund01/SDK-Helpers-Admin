angular.module('orderCloud.assignments', [])
    .controller('assignmentsCtrl', AssignmentsController)
    .directive('assignments', AssignmentsDirective);


function AssignmentsController($scope, AssignmentsSvc) {
    var vm = this;
    vm.focus = $scope.focus;
    vm.object = $scope.object;
    vm.target = $scope.target;
    vm.action = $scope.action;
    console.log(vm.focus, vm.object, vm.target, vm.action)



}


function AssignmentsDirective() {
    return {
        restrict: 'E',
        scope: {
            focus: '@',
            object: '=',
            target: '@',
            action: '@'
        },
        templateUrl: 'components/directives/assignments/assignments.tpl.html',
        controller: 'assignmentsCtrl',
        controllerAs: 'assignments'
    }
}