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

    return {
        searchUsers: _searchUsers,
        searchCategories: _searchCategories
    }
}