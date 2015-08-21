angular.module('orderCloud.assignments', [])
    .controller('assignmentsCtrl', AssignmentsController)
    .directive('assignments', AssignmentsDirective);


function AssignmentsController($scope, $rootScope, Categories, Products, AssignmentsSvc, Underscore) {
    var vm = this;
    vm.focus = $scope.focus;
    vm.object = $scope.object;
    vm.target = $scope.target;
    vm.action = $scope.action;
    vm.categoryList = [];
    vm.searchUsers = AssignmentsSvc.searchUsers;
    vm.searchCategories = AssignmentsSvc.searchCategories;
    vm.assignUserToProduct = assignUserToProduct;
    vm.useExistingPS = false;
    vm.useNewPS = true;
    vm.showExistingPS = showExistingPS;
    vm.showNewPS = showNewPS;
    vm.assignProductToCategory = AssignmentsSvc.assignProductToCategory;
    vm.updateCategoryAssignments = updateCategoryAssignments;

    if (vm.focus == 'products' && vm.target == 'categories' || vm.target == null) {
        updateCategoryAssignments();
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
    function updateCategoryAssignments() {
        Categories.GetProductCategories($rootScope.buyerID, vm.object.ID)
            .then(function(data) {
                //checks if each return item from data exists in array... pushes to end if not
                for (var i = 0; i < data.length; i++) {
                    console.log('hit first');
                    for (var b = 0; b < vm.categoryList.length; b++) {
                        console.log('hit second');
                        if (data[i].Name == vm.categoryList[b].Name) {
                            console.log('hit break');
                            break;
                        } else {
                            if (b == vm.categoryList.length - 1) {
                                console.log('hit push');
                                vm.categoryList.push(data[b])
                            }
                        }
                    }
                    if (vm.categoryList.length == 0) {
                        vm.categoryList = data;
                    }
                }

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