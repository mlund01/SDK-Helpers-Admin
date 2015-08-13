angular.module('orderCloud.productList')
    .config(productListConfig);

function productListConfig($stateProvider) {
    $stateProvider.state( 'base.productList', {
        url: '/productList',
        views: {
            '': {
                templateUrl:'productList/templates/productList.tpl.html',
                controller:'prodListCtrl',
                controllerAs: 'productList',
                data:{ pageTitle: 'Product List' }
            }
        },
        data:{ pageTitle: 'Product List' }
    });
}