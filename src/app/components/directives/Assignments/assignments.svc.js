angular.module('orderCloud.assignments')
    .factory('AssignmentsSvc', AssignmentsService);


function AssignmentsService($rootScope, Products, Categories, Users, UserGroups, PriceSchedules) {
    function _searchUsers(user) {
        return Users.List($rootScope.buyerID, user, 1, 20)
            .then(function(data){
                return data.Items;
            })
    }

    function _searchCategories(category) {
        return Categories.List($rootScope.buyerID, category, 1, 20)
            .then(function(data){
                return data.Items;
            })
    }

    function _assignProductToCategory(category, product, cb) {
        console.log('hit button');
        if (typeof category == 'object') {
            var assignment = {
                CategoryID: category.ID,
                ProductID: product.ID
            };
            Categories.SaveProductAssignments($rootScope.buyerID, assignment)
                .then(function(data) {
                    cb();
                })
        } else {
            return null;
        }


    }

    return {
        searchUsers: _searchUsers,
        searchCategories: _searchCategories,
        assignProductToCategory: _assignProductToCategory
    }
}