angular.module('orderCloud.productList')
    .controller('prodListCtrl', ProductListController);

function ProductListController(Categories, Products) {
    var vm = this;
    vm.buyerID = 'nghelper1';
    vm.categoryID = 'Cat1';
    getCategoryProducts();
    vm.deleteProduct = deleteProduct;
    vm.modifyProduct = modifyProduct;
    vm.addProduct = addProduct;


    function deleteProduct(productID) {
        Products.Delete(productID)
            .then(function(data) {
                getCategoryProducts()
            })
    }

    function modifyProduct(product, productMod) {
        Products.Patch(product.ID, productMod)
            .then(function(data) {
                getCategoryProducts();
            })
    }

    function addProduct(product) {
        product.ID = Math.floor(Math.random()*100000);
        product.QuantityMultiplier = 1;
        product.Type = 'static';
        product.StdOrders = true;

        Products.Create(product)
            .then(function(data) {
                Categories.SaveProductAssignments(vm.buyerID, {CategoryID: vm.categoryID, ProductID: data.ID, ListOrder: null})
                    .then(function(data) {
                        getCategoryProducts()
                    })
            })
    }


    function getCategoryProducts() {

        Products.GetCategoryProducts(vm.buyerID, vm.categoryID)
            .then(function(data) {
                vm.products = data;
            })
    }

    /*function getCategoryProducts(buyerID, categoryID, page, pageSize) {
        var dfd = $q.defer();
        var products = [];
        if (!categoryID) {
            Products.List()
        }

        Categories.ListProductAssignments(buyerID, categoryID, null, page, pageSize)
                .then(function(data) {
                    if (data.Items.length == 0) {
                        dfd.reject();
                    } else {
                        var items = data.Items;
                        for (var i = 0; i < items.length; i++) {
                            Products.Get(items[i].ProductID)
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
    }*/
}
