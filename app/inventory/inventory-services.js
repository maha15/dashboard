
nuageApp.service('InventoryDataService', ['$rootScope', '$http', '$q', '$uibModal',
    function ($rootScope, $http, $q, $uibModal) {
        var that = this;
        //   this.components = [{ required: [{ location: 'Toronto, Canada', units: 2 }, { location: 'NY, USA', units: 2 }, { location: 'Ontario, Canada', units: 2 }], Name: 'Tie Wraps', MOQ: 100, Unit: 1, Cost: '$6', Supplier: 'Supplier 1', DeliveryTime: '5 days' }];
        this.products = [
                    { sellingPrice: '10', Cost: '8', Name: 'Bag', leadTime: "5 days", size: "medium" },
                    { sellingPrice: '50', Cost: '30', Name: 'Clutch', leadTime: "1 day", size: "small" },
                    { sellingPrice: '100', Cost: '75', Name: 'Heels', leadTime: "3 days", size: "7.5" },
                    { sellingPrice: '110', Cost: '90', Name: 'Boots', leadTime: "4 days", size: "6.5" },
                    { sellingPrice: '20', Cost: '13', Name: 'Headphones', leadTime: "1 day", size: "-" },
                    { sellingPrice: '8', Cost: '6', Name: 'Frame', leadTime: "2 day", size: "medium" }];
        this.getRevisedInventoryProducts = function () {
            var defer = $q.defer();
            var data = {
                headings: [
                    { field: "Name", title: "Product", sortable: true },
                    { field: "inventory", title: "Inventory", sortable: true },
                    { field: "inventoryInStock", title: "Inventory In Stock", sortable: true, editable: true },
                ],
                data: [
                    { inventory: '55', inventoryInStock: '55', Name: 'Glasses' },
                    { inventory: '80', inventoryInStock: '80', Name: 'Sneakers' },
                    { inventory: '50', inventoryInStock: '50', Name: 'Scarf' },
                    { inventory: '40', inventoryInStock: '40', Name: 'Watch' },
                    { inventory: '15', inventoryInStock: '15', Name: 'Mobile Cover' },
                    { inventory: '18', inventoryInStock: '18', Name: 'Frame' }
                ]
            }
            defer.resolve(data);
            return defer.promise;
        };
        this.getCriticalProducts = function (filter) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'products/GetCriticleProductts',
                    data: filter
                })
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (reason) {
                    defer.reject(reason);
                });
            //var prods = [
            //   {
            //       details: false, sellingPrice: '10', Cost: '8', Name: 'Red Bag', leadTime: "5 days", size: "medium", components: [
            //           { Name: 'Leather Roll', location: 'Toronto, Canada', unit: 5, MOQ: 25, DeliveryTime: '5 days', Supplier: 'Supplier 1', },
            //           { Name: "Zip", location: 'NY, USA', unit: 5, MOQ: 12, DeliveryTime: '2 days', Supplier: 'Supplier 2' },
            //           { Name: 'Leather Roll', location: 'Ontario, Canada', unit: 5, MOQ: 6, DeliveryTime: '10 days', Supplier: 'Supplier 3' }
            //       ]
            //   },
            //   {
            //       details: false, sellingPrice: '50', Cost: '30', Name: 'Blue Clutch', leadTime: "1 day", size: "small", components: [
            //           { Name: 'Buttons', location: 'Toronto, Canada', unit: 5, MOQ: 25, DeliveryTime: '5 days', Supplier: 'Supplier 1', },
            //           { Name: 'Leather Roll', location: 'NY, USA', unit: 12, MOQ: 6, DeliveryTime: '10 days', Supplier: 'Supplier 3' },
            //           { Name: 'Zip', location: 'Ontario, Canada', unit: 12, MOQ: 12, DeliveryTime: '2 days', Supplier: 'Supplier 2' }
            //       ]
            //   },
            //   {
            //       details: false, sellingPrice: '110', Cost: '90', Name: 'Brown Boots', leadTime: "4 days", size: "6.5", components: [
            //           { Name: 'Leather Roll', location: 'LA, USA', unit: 5, MOQ: 25, DeliveryTime: '5 days', Supplier: 'Supplier 1', }
            //       ]
            //   },
            //];

            //defer.resolve(prods);
            return defer.promise;
        };
        this.getAllComponents = function (companyIDs) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'Component/GetComponet',
                    data: companyIDs
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getFilteredComponents = function (filter) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'Component/GetComponet',
                    data: filter
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getCriticalComponents = function (filter) {
            var defer = $q.defer();//,
            request = $http({
                method: 'POST',
                headers: { "content-type": "application/json", },
                url: $rootScope.baseURL + 'Component/GetCriticleComponents',
                data: filter
            })
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function (reason) {
                defer.reject(reason);
            });
            return defer.promise;
        };
        this.getSuppliers = function (companyIDs) {
            var defer = $q.defer(),
                request = $http({
                    method: 'GET',  //'POST'
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'Supplier/GetAll',
                    data: companyIDs
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getFilteredProducts = function (filter) {
            var defer = $q.defer();
            //,
            //    request = $http({
            //        method: 'POST',
            //        headers: { "content-type": "application/json", },
            //        url: $rootScope.baseURL + 'products/GetProductts',
            //        data: filter
            //    })
            //    .success(function (response) {
            //        defer.resolve(response);
            //    }).error(function (reason) {
            //        defer.reject(reason);
            //    });
            defer.resolve(this.products);
            return defer.promise;
        };

        this.getProducts = function () {
            var defer = $q.defer();
            defer.resolve(this.products);
            return defer.promise;
        }
        this.getFormattedComponents = function (inventory) {
            var data = {
                headings: [
                    { field: "Name", title: "Inventory", sortable: true },
                    { field: "Code", title: "Code", sortable: true },
                    { field: "MOQ", title: "MOQ", sortable: true },
                    { field: "Unit", title: "Unit", sortable: true },
                    { field: "Cost", title: "Cost", sortable: true },
                    { field: "Supplier", title: "Supplier", sortable: true },
                    { field: "DeliveryTime", title: "DeliveryTime", sortable: true }
                ],
                data: inventory
            }
            return data;
        };

        this.getFormattedProducts = function (prods) {
            var data = {
                headings: [
                    { field: "Name", title: "Products", sortable: true },
                    { field: "leadTime", title: "Lead Time", sortable: true },
                    { field: "size", title: "Size", sortable: true },
                    {
                        field: "sellingPrice", title: "Selling Price", sortable: true, formatter: function (value) {
                            return '$' + value;
                        }
                    },
                     {
                         field: "Cost", title: "Cost", sortable: true, formatter: function (value) {
                             return '$' + value;
                         }
                     }],
                data: prods
            }
            return data;
        };
        var addComponent = function (component) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'Component/AddComponent',
                    data: component
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        },
        addProduct = function (product) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'products/Add',
                    data: product
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.addProduct = function (components, companies) {
            var defer = $q.defer();
            var modalInstance = $uibModal.open({
                templateUrl: 'app/directives/new-product-tmpl.html',
                controller: 'newProductCtrl',
                size: 'md',
                resolve: {
                    components: function () {
                        return components || [];
                    },
                    companies: function () {
                        return companies || [];
                    }
                }
            });

            modalInstance.result.then(function (prod) {
                addProduct(prod).then(function () {
                    that.products.push(prod);
                    defer.resolve(prod);
                }, function () {
                    alert("Product could not be saved to DB.");
                    defer.reject();
                });
            }, function () { defer.reject(); });
            return defer.promise;
        };

        this.addComponent = function (companies) {
            var defer = $q.defer();
            var modalInstance = $uibModal.open({
                templateUrl: 'app/directives/new-component-tmpl.html',
                controller: 'newComponentCtrl',
                size: 'md',
                resolve: {
                    companies: function () {
                        return companies || [];
                    }
                }
            });

            modalInstance.result.then(function (comp) {
                addComponent(comp).then(function (c) {
                    defer.resolve(c);
                }, function () {
                    alert("Component could not be saved to DB.");
                    defer.reject();
                });
            }, function () { defer.reject(); });
            return defer.promise;
        };
        this.getFormattedOrderStatus = function (orderStatus) {
            function actionFormatter(value, row, index) {
                if (row.status == "Received")
                    return '<button type="button" class="btn btn-sm btn-success ripple ok ml10" title="Close"><span class="glyphicon glyphicon-ok"></span></button>';
                else
                    return '<button type="button" class="btn btn-sm btn-warning ripple remove ml10" title="Cancel"><span class="glyphicon glyphicon-remove"></span></button>';
            }

            //var actionEvents = {
            //    'click .ok': function (e, value, row, index) {
            //        $rootScope.$emit('inventory:orderStatusClose', { e: e, value: value, row: row, index: index });
            //    },
            //    'click .remove': function (e, value, row, index) {
            //        $rootScope.$emit('inventory:orderStatusCancel', { e: e, value: value, row: row, index: index });
            //    }
            //};
            //var data = {
            //    headings: [
            //        { field: "name", title: "Inventory", sortable: true },
            //        { field: "MOQ", title: "MOQ", sortable: true },
            //        { field: "Unit", title: "Unit", sortable: true },
            //        { field: "location", title: "Destination", sortable: true },
            //        { field: "Supplier", title: "Supplier", sortable: true },
            //        { field: "DeliveryTime", title: "DeliveryTime", sortable: true },
            //        { field: "status", title: "Status", sortable: true },
            //        { field: "orderid", title: "Action", formatter: actionFormatter, events: actionEvents }
            //    ],
            //    data: orderStatus
            //}
            var actionEvents = {
                'click .ok': function (e, value, row, index) {
                    $rootScope.$emit('inventory:orderStatusClose', index);
                },
                'click .remove': function (e, value, row, index) {
                    $rootScope.$emit('inventory:orderStatusCancel', index);
                }
            };
            var data = {
                headings: [
                    { field: "Name", title: "Inventory", sortable: true },
                    { field: "MOQ", title: "MOQ", sortable: true },
                    { field: "Unit", title: "Unit", sortable: true },
                    { field: "location", title: "Destination", sortable: true },
                    { field: "Supplier", title: "Supplier", sortable: true },
                    { field: "DeliveryTime", title: "DeliveryTime", sortable: true },
                    { field: "status", title: "Status", sortable: true },
                    { title: "Action", formatter: actionFormatter, events: actionEvents }
                ],
                data: orderStatus
            }
            return data;
        };
    }]);
