angular.module('orderCloud.test', [])
    .config(TestConfig);

function TestConfig($stateProvider) {
    $stateProvider.state( 'base.test', {
        url: '/test',
        views: {
            '': {
                templateUrl:'test/templates/test.tpl.html',
                controller:'testCtrl',
                controllerAs: 'test'
            }
        }
    });
}