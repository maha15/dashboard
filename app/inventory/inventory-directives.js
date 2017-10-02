nuageApp.directive('inventoryDirective', ['FormatService', 'InventoryDataService', '$rootScope',
    function (FormatService, InventoryDataService, $rootScope) {
        return {
            restrict: 'AE',
            templateUrl: 'app/inventory/directive-inventory-tmpl.html',
            link: function ($scope, elem, attrs) {

                $scope.inventorySelectedTab = 'forecast';
                $scope.setTab = function (newTab) { $scope.inventorySelectedTab = newTab; };

                $scope.dataI = [{
                    id: 'Product 1',
                    week1: 10,
                    week2: 11,
                    week3: 1,
                    week4: 15,
                }, {
                    id: 'Product 2',
                    week1: 25,
                    week2: 86,
                    week3: 3,
                    week4: 7,
                }, {
                    id: 'Product 3',
                    week1: 9,
                    week2: 64,
                    week3: 71,
                    week4: 3,
                }, {
                    id: 'Product 4',
                    week1: 4,
                    week2: 6,
                    week3: 14,
                    week4: 85,
                }];
                $scope.headingsI = [{
                    field: "id", title: "Products", sortable: true
                }, {
                    field: "week1", title: "Week 1", sortable: true
                }, {
                    field: "week2", title: "Week 2", sortable: true
                }, {
                    field: "week3", title: "Week 3", sortable: true, editable: true
                }, {
                    field: "week4", title: "Week 4", sortable: true, editable: true
                }];
                $scope.barChartOptionsI = {
                    title: {
                        text: 'Revenue Forecast',
                        show: false
                    },
                    toolbox: {
                        feature: {
                            magicType: { show: true, type: ['line', 'bar'] },
                        }
                    },
                    legend: { show: false, data: ['Products'] },
                    xAxis: { data: ['Bag', 'Shoes', 'Clutch', 'Boots'] },
                    markLineData: {
                        eoq: [400, 2700, 4000, 1100],
                        stock: [300, 2500, 4500, 900]
                    },
                    yAxis: {
                        //  axisLabel: { formatter: '${value}' },
                    },
                    series: [{
                        name: 'Products',
                        type: 'bar',
                        data: [{
                            value: 500,
                            itemStyle: { normal: { color: '#d3d3d3' } }
                            //custom itemStyle=，applicable to the item only, see itemStyle
                        },
                        {
                            value: 2600,
                            itemStyle: { normal: { color: '#d3d3d3' } },
                        },
                        {
                            value: 5000,
                            itemStyle: { normal: { color: '#d3d3d3' } },
                        },
                        {
                            value: 1100,
                            itemStyle: { normal: { color: '#d3d3d3' } },
                        }],
                        barWidth: 20,
                        markLine:
                        {
                            itemStyle: {
                                normal: {
                                    color: '#e48f24'
                                }
                            },
                            data: []
                        }
                    }]
                };
                var getFilter = function () {
                    var filter = { Companies: [], Outlets: [], States: [], Countries: [] };
                    if ($scope.filteredCompanies)
                        filter.Companies = $scope.getSelectedCompanies();
                    if ($scope.filteredInventoryOutlets) {
                        angular.forEach($scope.filteredInventoryOutlets, function (outlet) {
                            if (outlet.prop == "States") {
                                filter.States.push(outlet.value);
                            }
                            else if (outlet.prop == "Countries") {
                                filter.Countries.push(outlet.value);
                            }
                            else if (outlet.prop == "Outlets") {
                                filter.Outlets.push(outlet.value);
                            }
                        });
                    }
                    return filter;
                }
                $scope.$watch('filteredInventoryOutlets', function () {
                    //inventory tab

                    //setting tab
                    InventoryDataService.getCriticalComponents(getFilter()).then(function (prods) {
                        $scope.criticalComponents = prods;
                    }, function () { });

                    //setting product orders
                    InventoryDataService.getCriticalProducts(getFilter()).then(function (prods) {
                        $scope.criticalProducts = prods;
                    }, function () { });

                }, true);
                //inventory tab 
                $scope.selected = {
                    inventory: "product",
                    setting: "product"
                }

                $scope.$watch('selected.inventory', function (newVal, oldVal) {
                    if (newVal == 'product') {
                        var data = $scope.selectedInventoryData = [{ name: 'Boots', total: 35, need: 20, enough: 50, price: '$20' },
                      { name: 'Bags', total: 80, need: 30, enough: 45, price: '$40' },
                        { name: 'Sandles', total: 55, need: 45, enough: 60, price: '$10' },
                        { name: 'Accessories', total: 80, need: 25, enough: 55, price: '$50' },
                        { name: 'Pumps', total: 90, need: 55, enough: 70, price: '$90' }];

                        var inventoryInventoryProductData = FormatService.getInventoryLevels(data);
                        var axisFormat = { min: 0, max: 100, axisLabel: { formatter: '{value}%' }, };
                        setInventoryGraph(inventoryInventoryProductData, axisFormat);
                    }
                    if (newVal == 'inventory') {
                        var data = $scope.selectedInventoryData = [{ name: 'inventory 1', total: 80, need: 30, enough: 45 },
                            { name: 'inventory 2', total: 35, need: 20, enough: 50 },
                            { name: 'inventory 3', total: 55, need: 45, enough: 60 }];
                        var inventoryInventoryProductData = FormatService.getInventoryLevels(data);
                        var axisFormat = { axisLabel: { formatter: '{value}' }, };
                        setInventoryGraph(inventoryInventoryProductData, axisFormat);
                    }
                }, true);
                var setInventoryGraph = function (dataObj, axisFormat) {
                    $scope.inventoryBarChart = {
                        tooltip: {
                            show: true,
                            position: 'top',
                            showContent: true,
                            formatter: function (params) {
                                var sum = 0;
                                for (var i in params) { sum = sum + params[i].value; }
                                return sum + '%';
                            }
                        },
                        legend: { show: false, data: ['Products'] },
                        xAxis: { data: dataObj.x },
                        yAxis: axisFormat,
                        series: [
                        {
                            name: 'red',
                            type: 'bar',
                            barMaxWidth: 50,
                            stack: 'percentage',
                            data: dataObj.red,
                            itemStyle: { normal: { color: '#ec0707' } },

                        },
                        {
                            name: 'orange',
                            type: 'bar',
                            stack: 'percentage',
                            data: dataObj.orange,
                            itemStyle: { normal: { color: '#FFA500' } },
                        },
                        {
                            name: 'green',
                            type: 'bar',
                            stack: 'percentage',
                            data: dataObj.green,
                            itemStyle: { normal: { color: '#4cae4c' } },
                        },

                        ]
                    };
                }

                //setting tab

                $scope.$watch('selected.setting', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal == "product") {
                            InventoryDataService.getFilteredProducts(getFilter()).then(function (prods) {
                                $scope.inventorySettingTableData = InventoryDataService.getFormattedProducts(prods);
                            }, function () { });

                        }
                        else if (newVal == "inventory") {
                            InventoryDataService.getFilteredComponents(getFilter()).then(function (prods) {
                                $scope.inventorySettingTableData = InventoryDataService.getFormattedComponents(prods);
                            }, function () { });
                        }
                    }
                });
                $scope.addProduct = function () {
                    InventoryDataService.getAllComponents($scope.getSelectedCompanies()).then(function (components) {
                        InventoryDataService.addProduct(components, $scope.getSelectedCompanies()).then(function (prod) {
                        });
                    }, function () { });
                }

                //orders  tab
                $scope.orderStatusData = [];
                //InventoryDataService.getCriticalComponents(getFilter()).then(function (prods) {
                //    $scope.criticalComponents = prods;
                //}, function () { });

                $scope.orderInventory = function (inventory) {
                    var statuses = ["In Progress", "Dispatched", "Received"];
                    $scope.criticalComponents.splice($scope.criticalComponents.indexOf(inventory), 1);
                    angular.forEach(inventory.required, function (item) {
                        var invent = angular.copy(inventory);
                        invent.status = statuses[$scope.orderStatusData.length % 3];
                        invent.location = item.location;
                        $scope.orderStatusData.push(invent);
                    })
                    $scope.inventoryOrderStatus = InventoryDataService.getFormattedOrderStatus($scope.orderStatusData);
                    //     console.log(inventory);
                }
                $scope.roundUnits = function (units) {
                    return Math.round(units)
                };
                $rootScope.$on('inventory:orderStatusClose', function (event, orderIndex) {
                    $scope.inventoryOrderStatus.data.splice(orderIndex, 1);
                    $rootScope.$emit('refreshTable:inventoryOrderStatus', {});
                });
                $rootScope.$on('inventory:orderStatusCancel', function (event, orderIndex) {
                    $scope.inventoryOrderStatus.data.splice(orderIndex, 1);
                    $rootScope.$emit('refreshTable:inventoryOrderStatus', {});
                });

                //    $rootScope.$on('inventory:orderStatusClose', function (event, obj) {
                //    $scope.inventoryOrderStatus.data.splice(obj.index, 1);
                //    //       $rootScope.$emit('refreshTable:inventoryOrderStatus', {});
                //    $rootScope.$emit('removeTableElement:inventoryOrderStatus', obj);
                //});
                //$rootScope.$on('inventory:orderStatusCancel', function (event, obj) {
                //    $scope.inventoryOrderStatus.data.splice(obj.index, 1);
                //    // $rootScope.$emit('refreshTable:inventoryOrderStatus', {});
                //    $rootScope.$emit('removeTableElement:inventoryOrderStatus', obj);
                //});

                ////setting product orders
                //InventoryDataService.getCriticalProducts(getFilter()).then(function (prods) {
                //    $scope.criticalProducts = prods;
                //}, function () { });
                $scope.orderProductInventory = function (inventory) {
                    var statuses = ["In Progress", "Dispatched", "Received"];
                    $scope.criticalProducts.splice($scope.criticalProducts.indexOf(inventory), 1);
                    angular.forEach(inventory.components, function (item) {
                        item.status = statuses[$scope.orderStatusData.length % 3];
                        $scope.orderStatusData.push(item);
                    })
                    $scope.inventoryOrderStatus = InventoryDataService.getFormattedOrderStatus($scope.orderStatusData);
                    //     console.log(inventory);
                }

                //reviseinventory
                InventoryDataService.getRevisedInventoryProducts().then(function (prods) {
                    $scope.revisedInventory = prods;
                }, function () { });

            }
        }
    }]);