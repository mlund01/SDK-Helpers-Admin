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
        Categories.GetCatalogTree = GetCatalogTree;

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


        function GetCategoryTree(buyerID, userGroupID, userID, level, parentCategoryID) {
            var dfd = $q.defer();
            var parentList = [];
            var returnList = [];
            var filteredList = [];

            Categories.ListAll(buyerID)
                .then(function(data) {
                    data.Items.forEach(function(each) {
                        if (each.ParentID == null) {
                            parentList.push(each);
                        }
                    });

                    function buildTree(parent) {
                        parent.children = [];
                        data.Items.forEach(function(each){
                            if (parent.ID == each.ParentID) {
                                parent.children.push(each);
                            }
                        });
                        if (parent.children.length > 0) {
                            parent.children.forEach(function(each) {
                                buildTree(each);
                            })
                        }

                    }
                    parentList.forEach(function(each) {
                        buildTree(each);
                        returnList.push(each);
                    });

                    var targetCats = [];
                    if (userGroupID != null || userID != null) {
                        Categories.ListAllAssignmentsVerbose(buyerID, userGroupID, userID, level)
                            .then(function(data) {
                                data.Items.forEach(function(each){
                                    targetCats.push(each.Category.ID);
                                });

                                function scrape(object, parents) {
                                    parents.push(object.ID);
                                    console.log(parents);
                                    if (targetCats.indexOf(object.ID) != -1) {
                                        filteredList.push(object);

                                    } else {
                                        if (object.children.length > 0) {
                                            object.children.forEach(function(each) {
                                                scrape(each, parents);
                                            })
                                        }
                                    }
                                }

                                returnList.forEach(function(each) {
                                    var parents = [];
                                    scrape(each, parents);
                                });
                                dfd.resolve(filteredList);

                            });
                    } else {
                        dfd.resolve(returnList);
                    }


                });
            return dfd.promise;



            /*Categories.ListAllAssignmentsVerbose(buyerID, userGroupID, userID)
                .then(function(data) {
                    var pages = data.Meta.Pages;
                    var totalCount = data.Meta.TotalCount;
                    data.Items.forEach(function(each) {
                        tempList.push(each);
                    })
                    if (pages > 1) {
                        for (var i = 2; i <= pages; i++) {
                            Categories.GetCategoryList
                        }
                    }
                })*/
        }

        function GetCatalogTree(buyerID, groupID, userID) {

        }

        return Categories;
    })
}