# Angular SDK Extensions

Due to the modular nature of OrderCloud 3.0, we have built out a diverse set of SDK Extensions
to help you execute common workflows and build common objects. To keep everything succinct and ordered,
every Extension provided is a child of its parent SDK Service Object, meaning you can call each method from
the service it supports (eg. `Orders.HelperFn()`, `Categories.HelperFn()`, etc.)

Below is a list of the SDK Extensions that we have created. If you don't see an extension that you
think would be a useful addition, please let us know, or feel free to make a pull-request [here]
(https://github.com/Four51/OrderCloud-Angular-SDK-Extensions). You can view the source code in the
`/src` folder. We use the $provide/$delegate syntax to add each Extension to its
respective SDK Service Object. For more information on how that works, 
[here] (http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/) provides a good example of how 
to use it (note that our taskrunners take care of the angular annotations upon build, so you don't have to add that
yourself).



# Table of Contents
- [Categories](#categories)
  - [List All Categories](#list-all-categories)
  - [List Category Assignments with Objects](#list-category-assignments-verbose)
  - [List ALL Category Assignments with Objects](#list-all-category-assignments-verbose)
  - [List Category Product Assignments with Objects](#list-category-product-assignments-verbose)
  - [List ALL Category Product Assignments with Objects](#list-all-category-product-assignments-verbose)
  - [Get Category Tree](#get-category-tree)

# Categories <a name=categories><a>

```js
angular.module('orderCloud.sdk).factory(Orders, OrdersFactory)
```

## List All Categories <a name=list-all-categories></a>

```js
Categories.ListAll(buyerID, search);
```

### Description

Lists all categories without having to deal with pagination

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |  
|buyerID|string|ID of the buyer.|
|search|string|Search of the category.|

### Response Body Example

```json
   {
  "Meta": {
    "FunctionType": "SDK Extension",
    "TotalCount": 5
  },
  "Items": [
    {
      "ID": "Cat1",
      "Name": "Category1",
      "Description": "First Category",
      "xp": null,
      "ListOrder": 1,
      "Active": true,
      "ParentID": null
    },
    {
      "ID": "Cat5",
      "Name": "Category Five",
      "Description": "This is the fifth Category",
      "xp": null,
      "ListOrder": 1,
      "Active": true,
      "ParentID": "Cat1"
    },
    {
      "ID": "Cat3",
      "Name": "Category Three",
      "Description": "This is the third Category",
      "xp": null,
      "ListOrder": 1,
      "Active": true,
      "ParentID": "Cat5"
    },
    {
      "ID": "Cat2",
      "Name": "Category Two",
      "Description": "This is the second Category",
      "xp": null,
      "ListOrder": 1,
      "Active": true,
      "ParentID": "Cat5"
    },
    {
      "ID": "Cat4",
      "Name": "Category Four",
      "Description": "This is the fourth Category",
      "xp": null,
      "ListOrder": 1,
      "Active": true,
      "ParentID": "Cat1"
    }
  ]
}
```

## List Category Assignments with Objects <a name=list-category-assignments-verbose></a>

```js
Categories.ListAssignmentsVerbose(buyerID, userGroupID, userID, level, categoryID, page, pageSize)
```

### Description

processes a standard `Categories.ListAssignments` SDK API Call and replaces returned assignment ID's with their respective objects

### Parameters

| Name | Type | Description | Importance |
| -------------- | ----------- | --------------- | --------------- |
|buyerID|string|ID of the buyer.|REQUIRED|
|userGroupID|string|ID of the user group.|optional|
|userID|string|ID of the user.|optional|
|level|string|Level of the Category.|optional|
|categoryID|string|ID of the Category.|optional|
|page|integer|Page of the order.|optional|
|pageSize|integer|Page size of the order.|optional|

### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 5,
    "TotalPages": 1,
    "ItemRange": [
      1,
      5
    ],
    "FunctionType": "SDK Extension"
  },
  "Items": [
    {
      "Buyer": {
        "ID": "...",
        "Name": "...",
        "Active": true
      },
      "User": {
        "ID": "...",
        "Username": "...",
        "FirstName": "...",
        "LastName": "...",
        "Email": "...",
        "Phone": "...",
        "TermsAccepted": "0001-01-01T00:00:00+00:00",
        "Active": true,
        "xp": null
      },
      "UserGroup": null,
      "Category": {
        "ID": "...",
        "Name": "...",
        "Description": "...",
        "xp": null,
        "ListOrder": 1,
        "Active": true,
        "ParentID": "..."
      }
    },
    {
      "Buyer": {
        "ID": "...",
        "Name": "...",
        "Active": true
      },
      "User": null,
      "UserGroup": {
        "ID": "…",
        "Name": "…",
        "Description": "…",
        "ReportingGroup": false,
        "xp": null
      },
      "Category": {
        "ID": "...",
        "Name": "...",
        "Description": "...",
        "xp": null,
        "ListOrder": 1,
        "Active": true,
        "ParentID": "..."
      }
    }
  ]
}
```

## List ALL Category Assignments with Objects <a name=list-all-category-assignments-verbose></a>

```js
Categories.ListAllAssignmentsVerbose(buyerID, userID, userGroupID, level, categoryID)
```

### Description

Same as [List Assignments with Objects](#list-category-assignments-verbose), but lists all assignments without
having to deal with pagination

## List Category Product Assignments with Objects <a name=list-category-product-assignments-verbose></a>

```js
Categories.ListProductAssignmentsVerbose(buyerID, categoryID, productID, page, pageSize)
```

### Description

processes a standard `Categories.ListProductAssignments` SDK API Call and replaces returned assignment ID's with their respective objects

### Parameters

| Name | Type | Description | Importance |
| -------------- | ----------- | --------------- | --------------- |
|buyerID|string|ID of the buyer.|REQUIRED|
|categoryID|string|ID of the Category.|optional|
|productID|string|ID of the product.|optional|
|page|integer|Page of the order.|optional|
|pageSize|integer|Page size of the order.|optional|

### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 3,
    "TotalPages": 1,
    "ItemRange": [
      1,
      3
    ],
    "FunctionType": "SDK Extension"
  },
  "Items": [
    {
      "ListOrder": 0,
      "Product": {
        "ID": "...",
        "Description": "...",
        "Name": "...",
        "QuantityMultiplier": 1,
        "ShipWeight": null,
        "Active": true,
        "Type": "Static",
        "StdOrders": true,
        "ReplOrders": false,
        "InventoryEnabled": false,
        "InventoryNotificationPoint": null,
        "VariantLevelInventory": false,
        "xp": null,
        "ExceedInventory": true,
        "DisplayInventory": false
      },
      "Category": {
        "ID": "...",
        "Name": "...",
        "Description": "...",
        "xp": null,
        "ListOrder": 1,
        "Active": true,
        "ParentID": null
      }
    },
    {
      "ListOrder": 0,
      "Product": {
        "ID": "...",
        "Description": "...",
        "Name": "...",
        "QuantityMultiplier": 1,
        "ShipWeight": null,
        "Active": true,
        "Type": "Static",
        "StdOrders": true,
        "ReplOrders": false,
        "InventoryEnabled": false,
        "InventoryNotificationPoint": null,
        "VariantLevelInventory": false,
        "xp": null,
        "ExceedInventory": true,
        "DisplayInventory": false
      },
      "Category": {
        "ID": "...",
        "Name": "...",
        "Description": "...",
        "xp": null,
        "ListOrder": 1,
        "Active": true,
        "ParentID": "..."
      }
    }
  ]
}
```

## List ALL Category Product Assignments with Objects <a name=list-all-category-product-assignments-verbose></a>

```js
Categories.ListAllProductAssignmentsVerbose(buyerID, categoryID, productID)
```

### Description

Same as [List Product Assignments with Objects](#list-category-product-assignments-verbose), but lists all assignments without
having to deal with pagination

## Get Category Tree <a name=get-category-tree></a>

```js
Categories.GetCategoryTree(buyerID, userGroupID, userID, parentCategoryID)
```

### Description

Builds out a category tree with some added functionality to filter for userGroup, user, or parentCategoryID.
This will build a full category tree if no filter parameters are sent in.

### Parameters

| Name | Type | Description | Importance |
| -------------- | ----------- | --------------- | --------------- |
|buyerID|string|ID of the buyer.|REQUIRED|
|userGroupID|string|ID of the user group to filter by.|optional|
|userID|string|ID of the user to filter by.|optional|
|parentCategoryID|string/array|ID(s) of the parentCategoryID(s) to filter by.|optional|

### Response Body Sample

```json
[
  {
    "ID": "Cat1",
    "Name": "Category1",
    "Description": "First Category",
    "xp": null,
    "ListOrder": 1,
    "Active": true,
    "ParentID": null,
    "children": [
      {
        "ID": "Cat5",
        "Name": "Category Five",
        "Description": "This is the fifth Category",
        "xp": null,
        "ListOrder": 1,
        "Active": true,
        "ParentID": "Cat1",
        "children": [
          {
            "ID": "Cat3",
            "Name": "Category Three",
            "Description": "This is the third Category",
            "xp": null,
            "ListOrder": 1,
            "Active": true,
            "ParentID": "Cat5",
            "children": []
          }
        ]
      },
      {
        "ID": "Cat4",
        "Name": "Category Four",
        "Description": "This is the fourth Category",
        "xp": null,
        "ListOrder": 1,
        "Active": true,
        "ParentID": "Cat1",
        "children": []
      }
    ]
  }
]
```


