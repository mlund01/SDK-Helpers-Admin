angular.module('orderCloud.test')
    .controller('testCtrl', TestController);


function TestController(Categories, $rootScope) {
    var vm = this;
    vm.categories = {};

    vm.categories1 = function() {
        if (vm.categories.response1) {
            delete vm.categories.response1
        } else {
            Categories.ListProductAssignmentsVerbose($rootScope.buyerID, 'Cat1', null, 1, 20)
                .then(function(data) {
                    vm.categories.response1 = data;
                })
        }

    };

    vm.categories2 = function() {
        if (vm.categories.response2) {
            delete vm.categories.response2
        } else {
            Categories.ListAllProductAssignmentsVerbose($rootScope.buyerID, 'Cat1', null)
                .then(function(data) {
                    vm.categories.response2 = data;
                })
        }

    };

    vm.categories3 = function() {
        if (vm.categories.response3) {
            delete vm.categories.response3
        } else {
            Categories.ListAssignmentsVerbose($rootScope.buyerID)
                .then(function(data) {
                    vm.categories.response3 = data;
                })
        }

    };

    vm.categories4 = function() {
        if (vm.categories.response4) {
            delete vm.categories.response4
        } else {
            Categories.ListAllAssignmentsVerbose($rootScope.buyerID, null, 'user1')
                .then(function(data) {
                    vm.categories.response4 = data;
                })
        }

    };

    vm.categories5 = function() {
        if (vm.categories.response5) {
            delete vm.categories.response5
        } else {
            Categories.ListAll($rootScope.buyerID)
                .then(function(data) {
                    vm.categories.response5 = data;
                })
        }

    };

    vm.categories6 = function() {
        if (vm.categories.response6) {
            delete vm.categories.response6
        } else {
            Categories.GetCategoryTree($rootScope.buyerID, null, null, null, 'Cat5', true)
                .then(function(data) {
                    vm.categories.response6 = data;
                })
        }

    };

    vm.categories7 = function() {
        if (vm.categories.response7) {
            delete vm.categories.response7
        } else {
            Categories.GetCategoryTree($rootScope.buyerID, null, null, null, null, true)
                .then(function(data) {
                    vm.categories.response7 = data;
                })
        }

    };
}