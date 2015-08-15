angular.module('orderCloud.sdk')
    .config(ProductsDecorator);

function ProductsDecorator($provide) {
    $provide.decorator('Orders', function ($delegate, $q, LineItems) {

        var ListFn = $delegate.List;
        var CreateFn = $delegate.Create;

        function checkIfOrderExists(count, buyerID, order) {
            var dfd = $q.defer();
            if (count == 0) {
                CreateFn(buyerID, order)
                    .then(function(data) {
                        dfd.resolve(data);
                    })
            } else {
                dfd.resolve({orderExists: true});
            }
            return dfd.promise;
        }

        $delegate.AddProductToOrder = function(buyerID, lineItem, order, opts) {
            var dfd = $q.defer();
            var orderID = "";
            var found = false;
            var direction = opts.direction || 'Outgoing';
            var status = opts.status || 'unsubmitted';

            ListFn(direction, buyerID, status)
                .then(function(data) {
                    checkIfOrderExists(data.Meta.TotalCount, buyerID, order)
                        .then(function(orderInfo) {
                            if (orderInfo.orderExists) {
                                orderID = data.Items[0].ID;
                            } else {
                                orderID = orderInfo.ID;
                            }
                            LineItems.List(buyerID, orderID)
                                .then(function(data) {
                                    if (data.Meta.TotalCount == 0) {
                                        LineItems.Create(buyerID, orderID, lineItem)
                                            .then(function() {dfd.resolve()}, function(reason) {dfd.reject(reason)})
                                    } else {
                                        data.Items.forEach(function(each) {
                                            if (each.ProductID == lineItem.ProductID && found == false) {
                                                found = true;
                                                lineItem.ID = each.ID;
                                                lineItem.Quantity += each.Quantity;
                                                LineItems.Update(buyerID, orderID, lineItem.ID, lineItem)
                                                    .then(function() {dfd.resolve()}, function(reason) {dfd.reject(reason)})
                                            } else {
                                                if (each.ID == data.Items.slice(-1)[0].ID && found == false) {
                                                    LineItems.Create(buyerID, orderID, lineItem)
                                                        .then(function() {dfd.resolve()}, function(reason) {dfd.reject(reason)})
                                                }
                                            }
                                        });
                                    }
                                });
                        });
                });
            return dfd.promise;

        };





        return $delegate;

    })
}