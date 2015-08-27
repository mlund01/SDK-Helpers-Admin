angular.module('orderCloud.sdk')
    .config(CategoriesDecorator);

function CategoriesDecorator($provide) {
    $provide.decorator('Categories', function($delegate, $q, $injector, Underscore){
        var Categories = $delegate;
        var Products = $injector.get('Products');
        var Users = $injector.get('Users');
        var UserGroups = $injector.get('UserGroups');
        var Buyers = $injector.get('Buyers');

        Categories.ListAll = ListAll;
        Categories.ListProductAssignmentsVerbose = ListProductAssignmentsVerbose;
        Categories.ListAllProductAssignmentsVerbose = ListAllProductAssignmentsVerbose;
        Categories.ListAssignmentsVerbose = ListAssignmentsVerbose;
        Categories.ListAllAssignmentsVerbose = ListAllAssignmentsVerbose;
        Categories.GetCategoryTree = GetCategoryTree;

        function ListProductAssignmentsVerbose(buyerID, categoryID, productID, page, pageSize) { //returns list of categories assigned to productID in params
            var dfd = $q.defer(),
            tempObject = {},
            returnObject = {},
            returnList = [];

            Categories.ListProductAssignments(buyerID, categoryID, productID, page || 1 , pageSize || 100)
                .then(function(data) {
                    var totalCount = data.Meta.TotalCount;
                    var pSize = data.Meta.PageSize;
                    returnObject.Meta = data.Meta;
                    returnObject.Meta.FunctionType = 'SDK Extension';


                    for (var i = 0; i < data.Items.length; i++) {
                        var product = data.Items[i].ProductID;
                        var category = data.Items[i].CategoryID;
                        tempObject.ListOrder = data.Items[i].ListOrder;
                        $q.all([
                            Products.Get(product),
                            Categories.Get(buyerID, category)
                        ]).then(function(_data) {
                            tempObject.Product = _data[0];
                            tempObject.Category = _data[1];
                            returnList.push(tempObject);
                            tempObject = {};
                            if (returnList.length == totalCount || returnList.length == pSize) {
                                returnObject.Items = returnList;
                                dfd.resolve(returnObject);
                            }
                        }, function(reason){dfd.reject(reason)})
                    }

                    }, function(reason) {dfd.reject(reason)});
            return dfd.promise;
        }

        function ListAllProductAssignmentsVerbose(buyerID, categoryID, productID) {
            var dfd = $q.defer(),
            returnObject = {},
            result = [];

            Categories.ListProductAssignmentsVerbose(buyerID, categoryID, productID, 1, 100)
                .then(function(data) {
                    var pages = data.Meta.TotalPages;
                    var totalCount = data.Meta.TotalCount;
                    result = result.concat(data.Items);
                    if (result.length == totalCount) {
                        returnObject.Meta = {};
                        returnObject.Meta.FunctionType = 'SDK Extension';
                        returnObject.Meta.TotalCount = data.Meta.TotalCount;
                        returnObject.Items = [];
                        returnObject.Items = result;
                        dfd.resolve(returnObject);
                    }
                    if (pages > 1) {
                        for (var i = 2; i <= pages; i++) {
                            Categories.ListProductAssignmentsVerbose(buyerID, categoryID, productID, i, 100)
                                .then(function(data) {
                                    result = result.concat(data.Items);
                                    if (result.length == totalCount) {
                                        returnObject.Meta = {};
                                        returnObject.Meta.FunctionType = 'SDK Extension';
                                        returnObject.Meta.TotalCount = data.Meta.TotalCount;
                                        returnObject.Items = [];
                                        returnObject.Items = result;
                                        dfd.resolve(returnObject);
                                    }
                                }, function(reason) {dfd.reject(reason)})
                        }
                    }
                }, function(reason) {dfd.reject(reason)});


            return dfd.promise;
        }

        function getSingleUser(buyerID, userID) {
            var dfd = $q.defer();
            if (userID == null) {
                dfd.resolve(null);
            }
            else {
                Users.Get(buyerID, userID)
                    .then(function(data) {
                        dfd.resolve(data);
                    })
            }
            return dfd.promise;
        }

        function getSingleUserGroup(buyerID, userGroupID) {
            var dfd = $q.defer();
            if (userGroupID == null) {
                dfd.resolve(null);
            }
            else {
                UserGroups.Get(buyerID, userGroupID)
                    .then(function(data) {
                        dfd.resolve(data);
                    })
            }
            return dfd.promise;
        }
        function getSingleCategory(buyerID, categoryID) {
            var dfd = $q.defer();
            if (categoryID == null) {
                dfd.resolve(null);
            }
            else {
                Categories.Get(buyerID, categoryID)
                    .then(function(data) {
                        dfd.resolve(data);
                    })
            }
            return dfd.promise;
        }


        function ListAssignmentsVerbose(buyerID, userGroupID, userID, level, categoryID, page , pageSize) {
            var dfd = $q.defer();
            var tempObject = {};
            var result = [];
            var returnObject = {};
            Categories.ListAssignments(buyerID, userID, userGroupID, level, categoryID, page, pageSize)
                .then(function(data) {
                    var totalCount = data.Meta.TotalCount;
                    var pSize = data.Meta.PageSize;
                    returnObject.Meta = data.Meta;
                    returnObject.Meta.FunctionType = 'SDK Extension';


                    for (var i = 0; i < data.Items.length; i++) {
                        var category = data.Items[i].CategoryID;
                        var user = data.Items[i].UserID;
                        var userGroup = data.Items[i].UserGroupID;

                        $q.all([
                            Buyers.Get(buyerID),
                            getSingleUser(buyerID, user),
                            getSingleUserGroup(buyerID, userGroup),
                            getSingleCategory(buyerID, category)
                        ]).then(function(data) {
                            tempObject.Buyer = data[0];
                            if (data[1]) {
                                tempObject.User = data[1];
                            } else {
                                tempObject.User = null;
                            }
                            if (data[2]) {
                                tempObject.UserGroup = data[2];
                            } else {
                                tempObject.UserGroup = null;
                            }
                            if (data[3]) {
                                tempObject.Category = data[3];
                            } else {
                                tempObject.Category = null;
                            }
                            result.push(tempObject);
                            if (result.length == totalCount || result.length == pSize) {
                                returnObject.Items = result;
                                dfd.resolve(returnObject);
                            }
                            tempObject = {};
                            }, function(reason) {dfd.reject(reason);});
                    }
                }, function(reason) {dfd.reject(reason);});
            return dfd.promise;
        }

        function ListAllAssignmentsVerbose(buyerID, userGroupID, userID, level, categoryID) {
            var dfd = $q.defer(),
                returnObject = {},
                result = [];

            Categories.ListAssignmentsVerbose(buyerID, userGroupID, userID, level, categoryID, 1, 100)
                .then(function(data) {
                    var pages = data.Meta.TotalPages;
                    var totalCount = data.Meta.TotalCount;
                    result = result.concat(data.Items);
                    if (result.length == totalCount) {
                        returnObject.Meta = {};
                        returnObject.Meta.FunctionType = 'SDK Extension';
                        returnObject.Meta.TotalCount = data.Meta.TotalCount;
                        returnObject.Items = [];
                        returnObject.Items = result;
                        dfd.resolve(returnObject);
                    }
                    if (pages > 1) {
                        for (var i = 2; i <= pages; i++) {
                            Categories.ListAssignmentsVerbose(buyerID, userGroupID, userID, level, categoryID, i, 100)
                                .then(function(data) {
                                    result = result.concat(data.Items);
                                    if (result.length == totalCount) {
                                        returnObject.Meta = {};
                                        returnObject.Meta.FunctionType = 'SDK Extension';
                                        returnObject.Meta.TotalCount = data.Meta.TotalCount;
                                        returnObject.Items = [];
                                        returnObject.Items = result;
                                        dfd.resolve(returnObject);
                                    }
                                }, function(reason) {dfd.reject(reason)})
                        }
                    }
                }, function(reason) {dfd.reject(reason)});
            return dfd.promise;
        }

        function ListAll(buyerID, search) {
            var dfd = $q.defer(),
                returnObject = {},
                result = [];

            Categories.List(buyerID, search, 1, 1)
                .then(function(data) {
                    var pages = data.Meta.TotalPages;
                    var totalCount = data.Meta.TotalCount;
                    result = result.concat(data.Items);
                    if (result.length == totalCount) {
                        returnObject.Meta = {};
                        returnObject.Meta.FunctionType = 'SDK Extension';
                        returnObject.Meta.TotalCount = data.Meta.TotalCount;
                        returnObject.Items = [];
                        returnObject.Items = result;
                        dfd.resolve(returnObject);
                    }
                    if (pages > 1) {
                        for (var i = 2; i <= pages; i++) {
                            Categories.List(buyerID, search, i, 1)
                                .then(function(data) {
                                    result = result.concat(data.Items);
                                    if (result.length == totalCount) {
                                        returnObject.Meta = {};
                                        returnObject.Meta.FunctionType = 'SDK Extension';
                                        returnObject.Meta.TotalCount = data.Meta.TotalCount;
                                        returnObject.Items = [];
                                        returnObject.Items = result;
                                        dfd.resolve(returnObject);
                                    }
                                }, function(reason) {dfd.reject(reason)})
                        }
                    }
                }, function(reason) {dfd.reject(reason)});
            return dfd.promise;
        }


        function GetCategoryTree(buyerID, userGroupID, userID, level, parentCategoryID, showProducts) {
            var dfd = $q.defer();
            var parentList = [];
            var returnList = [];

            Categories.ListAll(buyerID)
                .then(function(data) {
                    data.Items.forEach(function(each) {
                        if (each.ParentID == null) {
                            parentList.push(each);
                        }
                    });

                    function buildTree(parent) {
                        if (showProducts) {
                            parent.Products = [];
                        }
                        parent.Children = [];
                        data.Items.forEach(function(each){
                            if (parent.ID == each.ParentID) {
                                parent.Children.push(each);
                            }
                        });
                        if (parent.Children.length > 0) {
                            parent.Children.forEach(function(each) {
                                buildTree(each);
                            })
                        }

                    }
                    parentList.forEach(function(each) {
                        buildTree(each);
                        returnList.push(each);
                    });

                    parentTreeFilter(parentCategoryID, returnList)
                        .then(function(list) {
                            treeFilter(buyerID, userGroupID, userID, level, list)
                                .then(function(list) {
                                    addProductsToTree(buyerID, showProducts, list)
                                        .then(function(list) {
                                            dfd.resolve(list);
                                        });

                                })
                        })

                });
            return dfd.promise;
        }






        function addProducts(buyerID, object) {
            var dfd = $q.defer();
            function loopTree(obj) {
                var nodeCount = countNodes(obj);
                var count = 0;
                Categories.ListAllProductAssignmentsVerbose(buyerID, obj.ID)
                    .then(function(data) {
                        count++;

                        if (data.Items.length > 0) {
                            data.Items.forEach(function(each) {
                                obj.Products.push(each.Product);
                            })
                        }
                        if (count == nodeCount) {
                            dfd.resolve(object);
                        }
                    }, function(reason) {dfd.reject(reason)});
                if (obj.Children.length > 0) {
                    obj.Children.forEach(function(each) {
                        loopTree(each);
                    })
                }

            }

            loopTree(object);
            return dfd.promise;
        }

        function addProductsToTree(buyerID, showProducts, list) {
            var dfd = $q.defer();
            var parentNodeCount = list.length;
            var count = 0;
            var outputList = [];
            if (showProducts == true) {
                list.forEach(function(eachObj) {
                    addProducts(buyerID, eachObj)
                        .then(function(data) {
                            count++;
                            outputList.push(data);
                            if (count == parentNodeCount) {
                                dfd.resolve(list);
                            }
                        })
                });
            } else {
                dfd.resolve(list);
            }


            return dfd.promise;

        }

        function countNodes(treeObject) {
            var nodeCount = 0;

            function getNodeCount(object){
                nodeCount++;
                if (object.Children > 0) {
                    object.Children.forEach(function(each) {
                        getNodeCount(each)
                    })
                }
            }

            getNodeCount(treeObject);
            return nodeCount;

        }

        function treeFilter(buyerID, userGroupID, userID, level, list) {
            var dfd = $q.defer();
            if (userGroupID || userID) {
                var filteredList = [];
                var targetCats = [];
                Categories.ListAllAssignmentsVerbose(buyerID, userGroupID, userID, level)
                    .then(function(data) {
                        data.Items.forEach(function(each){
                            targetCats.push(each.Category.ID);
                        });

                        function filterScrape(object, parents) {
                            parents.push(object.ID);
                            if (targetCats.indexOf(object.ID) != -1) {
                                filteredList.push(object);

                            } else {
                                if (object.Children.length > 0) {
                                    object.Children.forEach(function(each) {
                                        filterScrape(each, parents);
                                    })
                                }
                            }
                        }

                        list.forEach(function(each) {
                            var parents = [];
                            filterScrape(each, parents);
                        });
                        dfd.resolve(filteredList);

                    });
            } else {
                dfd.resolve(list);
            }
            return dfd.promise;
        }

        function parentTreeFilter(parentID, list) {
            var dfd = $q.defer();
            if (parentID) {
                var filteredParentList = [];
                closure()
                    .then(function() {
                        function parentScrape(object) {
                            if (object.ID == parentID || parentID.isArray && parentID.indexOf(object.ID) != -1) {
                                filteredParentList.push(object);
                            } else {
                                object.Children.forEach(function(each) {
                                    parentScrape(each);
                                })
                            }
                        }
                        list.forEach(function(each) {
                            parentScrape(each);
                        });
                        dfd.resolve(filteredParentList);
                    })

            } else {
                dfd.resolve(list);
            }

            return dfd.promise;
        }

        function closure() {
            var dfd = $q.defer();
            dfd.resolve();
            return dfd.promise;
        }


        return Categories;
    })
}





