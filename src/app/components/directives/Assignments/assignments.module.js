angular.module('orderCloud.assignments', [])
    .controller('assignmentsCtrl', AssignmentsController)
    .directive('assignments', AssignmentsDirective);


function AssignmentsController($scope, $rootScope, Categories, Products, AssignmentsSvc) {
    var vm = this;
    vm.focus = $scope.focus;
    vm.object = $scope.object;
    vm.target = $scope.target;
    vm.action = $scope.action;
    vm.searchUsers = AssignmentsSvc.searchUsers;
    vm.assignUserToProduct = assignUserToProduct;
    vm.useExistingPS = false;
    vm.useNewPS = true;
    vm.showExistingPS = showExistingPS;
    vm.showNewPS = showNewPS;

    if (vm.focus == 'products' && vm.target == 'categories' || vm.target == null) {
        updateUserAssignments();
    }
    if (vm.focus == 'products' && vm.target == 'users' || vm.target == null) {
        updateProductUsers();
    }

    function assignUserToProduct(userID, productID) {
        var assignment = {
            ProductID: productID,
            UserID: userID,
            BuyerID: $rootScope.buyerID
        };
        Products.SaveProductAssignment(assignment)
            .then(function(data) {
                updateProductUsers();
            })
    }
    function updateUserAssignments() {
        Categories.GetProductCategories($rootScope.buyerID, vm.object.ID)
            .then(function(data) {
                vm.categoryList = data;
            })
    }

    function updateProductUsers() {
        Products.GetProductUsers($rootScope.buyerID, vm.object.ID)
            .then(function(data) {
                vm.productUserList = data;
            })
    }

    function showExistingPS() {
        vm.useExistingPS = true;
        vm.useNewPS = false;
    }

    function showNewPS() {
        vm.useNewPS = true;
        vm.useExistingPS = false;
    }




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