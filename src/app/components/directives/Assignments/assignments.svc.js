angular.module('orderCloud.assignments')
    .factory('AssignmentsSvc', AssignmentsService);


function AssignmentsService(Products, Categories, Users, UserGroups, PriceSchedules) {
    function _assignProductToCategory(buyerID, product, category) {
        return "hello"
    }

    return {
        assignProductToCategory: _assignProductToCategory
    }
}