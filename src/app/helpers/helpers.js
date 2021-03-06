angular.module('orderCloud.sdk')
    .factory('Helpers', HelperFactory);


function HelperFactory(Categories, Products, Users, UserGroups, PriceSchedules, Underscore) {
    /*
     ********
     ********
     Categories
     ********
     ********
     */
    Categories.GetProductCategories = function(buyerID, productID) {
        var dfd = $q.defer();
        var categories = [];
        Categories.ListProductAssignments(buyerID, null, productID, 1, 20)
            .then(function(data) {
                var pages = data.Meta.TotalPages;
                var totalCount = data.Meta.TotalCount;
                data.Items.forEach(function(each) {
                    Categories.Get(buyerID, each.CategoryID)
                        .then(function(cat) {
                            categories.push(cat);
                            if (categories.length == totalCount) {
                                dfd.resolve(categories)
                            }
                        })
                });
                if (pages > 1) {
                    for (var i = 2; i <= pages; i++) {
                        Categories.ListProductAssignments(buyerID, null, productID, i, 20)
                            .then(function(data) {
                                data.Items.forEach(function(each) {
                                    Categories.Get(buyerID, each.CategoryID)
                                        .then(function(cat) {
                                            categories.push(cat);
                                            if (categories.length == totalCount) {
                                                dfd.resolve(categories)
                                            }
                                        })
                                });
                            }, function(reason) {dfd.reject(reason);})
                    }
                }
            }, function(reason) {dfd.reject(reason);});
        return dfd.promise;
    };
    
    /*
    ********
    ********
    Products
    ********
    ********
    */



    /*
     ********
     ********
     Users
     ********
     ********
     */


    /*
     ********
     ********
     UserGroups
     ********
     ********
     */


    /*
     ********
     ********
     PriceSchedules
     ********
     ********
     */


    return {
        GetProductList: _GetProductList,
        GetProductUsers: _GetProductUsers
    }
}