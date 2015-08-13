angular.module('orderCloud.sdk')
    .config(ProductsDecorator);

function ProductsDecorator($provide) {
    $provide.decorator('Products', function ($delegate, $q, Categories) {

        //Predefined Service Functions to be used in decorator
        var GetFn = $delegate.Get;
        var ListFn = $delegate.List;


        $delegate.GetCategoryProducts = function(buyerID, categoryID, page, pageSize) {
            var dfd = $q.defer();
            var products = [];
            if (!categoryID) {
                ListFn()
                    .then(function(data) {dfd.resolve(data)}, function(reason) {dfd.reject(reason)})
            } else {
                Categories.ListProductAssignments(buyerID, categoryID, null, page, pageSize)
                    .then(function(data) {
                        if (data.Items.length == 0) {
                            dfd.resolve([]);
                        } else {
                            var items = data.Items;
                            for (var i = 0; i < items.length; i++) {
                                GetFn(items[i].ProductID)
                                    .then(function (prodData) {
                                        products.push(prodData);
                                        if (products.length == items.length) {
                                            dfd.resolve(products);
                                        }
                                    }, function(reason) {
                                        dfd.reject(reason);
                                    })
                            }
                        }
                    });
            }
            return dfd.promise;

        };



        return $delegate;

    })
}