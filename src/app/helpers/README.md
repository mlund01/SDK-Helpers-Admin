# SDK Helper Functions

Due to the modular nature of OrderCloud 3.0, we have built out a diverse set of SDK Helper Functions
to help you execute common workflows and build common objects. To keep everything succinct and ordered,
every Helper Function is an extension of its parent SDK Service Object, meaning you can call each method from
the service in which it is derived (eg. `Orders.HelperFn()`, `Categories.HelperFn()`, etc.) and won't have to
add anymore dependencies into your angular app than you already have (so long as you are already using
the SDK Service Object itself!)

Below is a list of the Helper Functions that we have created. If you don't see a helper function that you
think would be a useful addition, please let us know, or feel free to make a pull-request [here]
(https://github.com/Four51/OrderCloud-Angular-SDK). You can view the Helper Function source code in the
'src/Factory/Helpers' folder. We use the $provide/$delegate syntax to add each Helper Function to its
respective SDK Service Object. For more information on how that works, 
[here] (http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/) is a good example of how 
to use it (note that our taskrunners take care of the angular annotations upon build, so you don't have to add that
yourself).

And finally, these Helper Functions deal with many objects that are used in standard API calls. 
To save space and time, we have not listed what those object look like below. These objects, however, are
listed in the standard [API Documentation] (http://four51.github.io/docs/reference/)


## Orders

### AddProductToOrder
API Call: `Orders.AddProductToOrder(buyerID, lineItem, order, opts)`
Description: This Workflow takes care of the common process of adding a product to an order with some standard
validations such as checking if an order or lineItem already exist, and dealing with each scenario properly.
#### Workflow
1. List current orders
  a. Create new order if no order exist
  b. Get current order if order does exist
2. List lineItems
  a. Create lineItem if no lineItems exist
  b. Loop Through lineItems
    i. create new lineItem if product doesn't have a lineItem
    ii. increment quantity of lineItem if product lineItem exists by `Quantity` in `lineItem` param
    

#### Parameters
##### lineItem (object, required)
Your lineItem to be added to order if order lineItem with ProductID does not already exist
- `lineItem.ID` is optional. It will autogenerate if you do not provide
- minimum requirements: `lineItem.ProductID` and `lineItem.Quantity`
- suggested requirements: `lineItem.ShippingID` (will be required when submitting order)

##### order (object, optional)
Your order object to be created if one does not already exist
- `order.ID` will autogenerate if you do not provide

##### opts (object, optional)
Set of options to be used in order search
```
{
  direction: "...",
  status: "..."
}
```
Defaults:
```
{
  direction: "Outgoing",
  status: "unsubmitted"
}
```


## Products

### GetCategoryProducts
API Call: `Products.GetCategoryProducts`
Description: `Get all products that are descendents of a category.

####Workflow
1. 



