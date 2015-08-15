angular.module('orderCloud.productList')
    .controller('prodListCtrl', ProductListController);

function ProductListController(Categories, Products, UserGroups, Users) {
    var vm = this;
    vm.buyerID = 'nghelper1';
    vm.categoryID = 'Cat1';
    getCategoryProducts();
    vm.deleteProduct = deleteProduct;
    vm.modifyProduct = modifyProduct;
    vm.addProduct = addProduct;
    vm.getUserGroups = getUserGroups;
    vm.getUsers = getUsers;
    vm.getCategories = getCategories;
    vm.getPriceSchedules = getPriceSchedules;


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

    function modifyProductAssignments(assignments) {
        if (assignments.category) {
            //create category assignment
        }
        if (assignments.userGroup) {
            //create userGroup assignment
        }
        if (assignments.user) {
            //create userGroup assignment
        }
        if (assignment.priceSchedule) {
            //create priceSchedule assignment
        }
    }


    function getCategoryProducts() {

        Products.GetProductList(vm.buyerID, vm.categoryID)
            .then(function(data) {
                vm.products = data;
            })
    }


    function getUserGroups(userGroup) {
        return UserGroups.List(vm.buyerID, userGroup, 1, 20)
            .then(function(data){
                return data.Items;
            })
    }

    function getUsers(user) {
        return Users.List(vm.buyerID, user, 1, 20)
            .then(function(data){
                return data.Items;
            })
    }

    function getCategories(category) {
        return Categories.List(vm.buyerID, category, 1, 20)
            .then(function(data){
                return data.Items;
            })
    }

    function getPriceSchedules(priceSchedule) {
        // no PriceSchedule search function
    }
}
