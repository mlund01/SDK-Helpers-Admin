angular.module('orderCloud.sdk')
    .config(ProductsDecorator)

function ProductsDecorator($provide) {
    $provide.decorator('Products', function ($delegate, $q, Underscore) {

        //Predefined Service Functions to be used in decorator
        var Products = $delegate;

        $delegate.GetProductList = _GetProductList;
        $delegate.GetProductUsers = _GetProductUsers;


        function GetCategoryProductIDs(buyerID, categoryID) {
            var dfd = $q.defer();
            var productIDs = [];

            if (!categoryID) {
                Products.List()
                    .then(function(data) {dfd.resolve(data)}, function(reason) {dfd.reject(reason)})
            } else {
                Categories_ListProductAssignments(buyerID, categoryID, null, 1, 20) //Collects Meta Data
                    .then(function(data) {
                        var pageCount = data.Meta.TotalPages;
                        var productCount = data.Meta.TotalCount;
                        if (pageCount == 0) {
                            dfd.resolve([]);
                        } else {
                            data.Items.forEach(function(each) {
                                productIDs.push(each.ProductID);
                                if (productIDs.length == productCount) {
                                    dfd.resolve(productIDs);
                                }
                            });
                            if (pageCount > 1) {
                                for (var i = 2; i <= pageCount; i++) {
                                    Categories_ListProductAssignments(buyerID, categoryID, null, i, 20) //grabs product Assignments
                                        .then(function (data) {
                                            data.Items.forEach(function (each) {
                                                productIDs.push(each.ProductID);
                                                if (productIDs.length == productCount) {
                                                    dfd.resolve(productIDs);
                                                }
                                            })
                                        })
                                }
                            }
                        }
                    });
            }
            return dfd.promise;
        }

        function ListProductAssignmentIDs (buyerID, standardPriceScheduleID, replenishmentPriceScheduleID, userID, groupID, level) {
            var dfd = $q.defer();
            var productIDs = [];
            if (!standardPriceScheduleID && !replenishmentPriceScheduleID && !userID && !groupID && !level) {
                dfd.resolve({ignore: true})
            } else {
                Products.ListProductAssignments(buyerID, null, standardPriceScheduleID, replenishmentPriceScheduleID, userID, groupID, level, 1, 20)
                    .then(function(data) {
                        var pageCount = data.Meta.TotalPages;
                        var productCount = data.Meta.TotalCount;
                        if (pageCount == 0) {
                            dfd.resolve([])
                        } else {
                            data.Items.forEach(function(each) {
                                productIDs.push(each.ProductID);
                                if (productIDs.length == productCount) {
                                    dfd.resolve(productIDs);
                                }
                            });
                            if (pageCount > 1) {
                                for (var i = 2; i <= pageCount; i++) {
                                    Products.ListProductAssignments(buyerID, null, standardPriceScheduleID, replenishmentPriceScheduleID, userID, groupID, level, i, 20)
                                        .then(function(data) {
                                            data.Items.forEach(function(each) {
                                                productIDs.push(each.ProductID);
                                                if (productIDs.length == productCount) {
                                                    dfd.resolve(productIDs);
                                                }
                                            })
                                        })
                                }
                            }
                        }
                    });
            }
            return dfd.promise;
        }


        function _GetProductList(buyerID, categoryID, userGroupID, userID, standardPriceScheduleID, replenishmentPriceScheduleID, level) {
            var dfd = $q.defer();
            var products = [];
            if (!categoryID) {
                Products.List()
                    .then(function(data) {dfd.resolve(data)}, function(reason) {dfd.reject(reason)})
            } else {
                $q.all([
                    GetCategoryProductIDs(buyerID, categoryID),
                    ListProductAssignmentIDs(buyerID, standardPriceScheduleID, replenishmentPriceScheduleID, userID, userGroupID, level)
            ]).then(function(data) {
                        var productListIDs = [];
                        if (data[1].ignore) {
                            productListIDs = data[0];
                        } else {
                            productListIDs = Underscore.intersection(data[0], data[1]);
                        }
                        var lastProd = false;
                        productListIDs.forEach(function(each) {
                            if (each == productListIDs.slice(-1)[0]) {
                                lastProd = true;
                            }
                            Products.Get(each)
                                .then(function(data) {
                                    products.push(data);
                                    if (lastProd) {
                                        dfd.resolve(products);
                                    }
                                })
                        })
                    })
            }
            return dfd.promise;

        }

        function _GetProductUsers(buyerID, productID) {
            var dfd = $q.defer();
            var productUsers = [];
            Products.ListProductAssignments(buyerID, productID, null, null, null, null, null, 1, 20)
                .then(function(data) {
                    var pages = data.Meta.TotalPages;
                    var totalCount = data.Meta.TotalCount;
                    data.Items.forEach(function(data) {
                        var user = data.UserID;
                        Users_Get(buyerID, user)
                            .then(function(data) {
                                productUsers.push(data);
                                if (productUsers.length == totalCount) {
                                    dfd.resolve(productUsers);
                                }
                            }, function(response) {dfd.reject(response)})
                    });
                    if (pages > 1) {
                        for (var i = 2; i <= pages; i++) {
                            Products.ListProductAssignments(buyerID, productID, null, null, null, null, null, i, 20)
                                .then(function(data) {
                                    data.Items.forEach(function(data) {
                                        var user = data.UserID;
                                        Users_Get(buyerID, user)
                                            .then(function(data) {
                                                productUsers.push(data);
                                                if (productUsers.length == totalCount) {
                                                    dfd.resolve(productUsers);
                                                }
                                            })
                                    });
                                }, function(response) {dfd.reject(response)})
                        }
                    }
                });


            return dfd.promise;
        }


        return $delegate;

    })
}
