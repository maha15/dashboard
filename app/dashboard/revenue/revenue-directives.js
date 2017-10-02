nuageApp.directive('revenueDirective', ['$q', 'RevenueDataService', 'MainDataService', 'FormatService', 'UploadDocService', 'AlertMessage',
    function ($q, RevenueDataService, MainDataService, FormatService, UploadDocService, AlertMessage) {
        return {
            restrict: 'AE',
            templateUrl: 'app/dashboard/revenue/directive-revenue-tmpl.html',
            link: function ($scope, elem, attrs) {
                var addAreaChartSeriesOptions = function (name, data) {
                    return {
                        name: name,
                        type: 'bar',
                        stack: 'gross',
                        //   itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: data
                    }
                },
                areaChartOptions = {
                    title: { text: 'Revenue & Gross Margin', },
                    legend: { data: ['Total Sales', 'Gross Margin'] },
                    toolbox: { show: false },
                    //      grid: { y: 40, y2: 40, x2: 30 }, 
                    //   grid: { x2: 20 },
                    xAxis: [{
                        type: "category",
                        data: [],
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitArea: { show: false },
                        splitLine: { show: false },

                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitArea: { show: false },
                        splitLine: { show: false },
                    }],
                    series: []
                },
                addBarChartSeriesOptions = function (name, type, data) {
                    return {
                        name: name,
                        type: type,
                        data: data
                    }
                },
                barChartOptions = {
                    title: {
                        text: 'Sales',
                        //   subtext: 'Last six months'
                    },
                    toolbox: { show: false },
                    legend: { data: ['Actual', 'Forecasted'] },
                    grid: { x: 70 },
                    xAxis: [{
                        type: "category",
                        data: [],
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitArea: { show: false },
                        splitLine: { show: false },

                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitArea: { show: false },
                        splitLine: { show: false },
                    }],// {axisLabel: { formatter: '{value}' }},
                    series: []
                };
                var getData = function (addTimeFilter) {
                    var filter = { companyids: [], outlets: [], states: [], countries: [], productCategories: [], time: 'Daily' };
                    if ($scope.filteredCompanies)
                        filter.companyids = $scope.getSelectedCompanies();
                    if ($scope.filteredOutlets) {
                        angular.forEach($scope.filteredOutlets, function (outlet) {
                            if (outlet.prop == "States") {
                                filter.states.push(outlet.value);
                            }
                            else if (outlet.prop == "Countries") {
                                filter.countries.push(outlet.value);
                            }
                            else if (outlet.prop == "Outlets") {
                                filter.outlets.push(outlet.value);
                            }
                        });
                    }
                    if ($scope.filteredProductCategories)
                        filter.productCategories = $scope.filteredProductCategories.map(function (c) { return c.Id; });
                    if ($scope.filteredView && $scope.filteredView.length)
                        filter.time = $scope.filteredView[0].value;

                    RevenueDataService.getCompanyRevenueGrossMargin(filter).then(function (data) {
                        if (data.length) {
                            var x = [], yArr = {};
                            var props = areaChartOptions.legend.data;
                            for (var i in data) {
                                if (i == 0) { yArr[props[0]] = []; yArr[props[1]] = []; }
                                yArr[props[0]].push(data[i].TotalSales);
                                yArr[props[1]].push(data[i].GrossMargin);
                                x.push(data[i].Time);
                            }

                            areaChartOptions.xAxis[0].data = x;
                            areaChartOptions.series = [];
                            angular.forEach(props, function (prop) {
                                areaChartOptions.series.push(addAreaChartSeriesOptions(prop, yArr[prop]));
                            });
                            $scope.areaChartOptions = areaChartOptions;
                        }
                    });

                    if (!addTimeFilter) {
                        RevenueDataService.getCompanySales(filter).then(function (data) {
                            if (data.length) {
                                var x = [], yArr = {}, type = {};
                                var props = barChartOptions.legend.data;
                                for (var i in data) {
                                    if (i == 0) {
                                        yArr[props[0]] = [];
                                        yArr[props[1]] = [];
                                        type[props[0]] = 'line';
                                        type[props[1]] = 'line'
                                    }
                                    if (i > 2) {
                                        yArr[props[0]].push(null);
                                        yArr[props[1]].push(data[i].ForcastSales);
                                    } else if (i < 2) {
                                        yArr[props[0]].push(data[i].TotalSales);
                                        yArr[props[1]].push(null);
                                    }
                                    else {
                                        yArr[props[0]].push(data[i].TotalSales);
                                        yArr[props[1]].push(data[i].ForcastSales);
                                    }
                                    x.push(data[i].Date);
                                }

                                barChartOptions.xAxis[0].data = x;
                                barChartOptions.series = [];
                                angular.forEach(props, function (prop) {
                                    barChartOptions.series.push(addBarChartSeriesOptions(prop, type[prop], yArr[prop]));
                                });
                                $scope.barChartOptions = barChartOptions;
                            }
                        });
                    }
                }
                $scope.$watch('filteredCompanies + filteredOutlets + filteredProductCategories', function (newVal, oldVal) {
                    getData();
                }, true);
                $scope.$watch('filteredView', function () {
                    getData(true);
                }, true);

                //dropdowns
                $scope.views = [{ name: 'Yearly view', value: 'Yearly' }, { name: 'Monthly view', value: 'Monthly' }, { name: 'Daily view', value: 'Daily' }];
                $scope.$watch('filteredCompanies', function (newVal, oldVal) {
                    if (newVal && newVal.length) {
                        var selectedCompanies = $scope.getSelectedCompanies();
                        $scope.loadCompanyOutlets(selectedCompanies);
                        $scope.loadCompanyProductCategories(selectedCompanies);
                    }
                });
                $scope.loadCompanyOutlets = function (selectedCompanies) {
                    var defer = $q.defer();
                    FormatService.getFormattedCompanyOutelets(selectedCompanies).then(function (outlets) {
                        $scope.outlets = outlets;
                        $scope.inventoryOutlets = angular.copy($scope.outlets);
                        defer.resolve();
                    }, function () {
                        console.error('could not load company outlets');
                        defer.reject();
                    });
                    return defer.promise;
                };
                $scope.loadCompanyProductCategories = function (selectedCompanies) {
                    var defer = $q.defer();
                    MainDataService.getCompanyProductCategories(selectedCompanies).then(function (productCategories) {
                        $scope.productCategories = FormatService.getCompanyProductCategories(productCategories) || [];
                        defer.resolve();
                    }, function () {
                        console.error('could not load company productCategories');
                        defer.reject();
                    });
                    return defer.promise;
                };
                $scope.addRevenueAttachment = function () {
                    UploadDocService.uploadDocs().then(function (file) {
                        //    if (file)
                        AlertMessage.success("File added successfully");
                    }, function () {
                    });
                };
            }
        }
    }]);
nuageApp.directive('revenueDetailDirective', function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/dashboard/revenue/directive-revenue-detail-tmpl.html',
        link: function ($scope, elem, attrs) {
            $scope.data = [{
                id: 1,
                sellingprice: '2.00',
                cost: '1.20',
                productmanager: 'Pérez',
                profit: '0.80',
            }, {
                id: 2,
                sellingprice: '3.00',
                cost: '3.00',
                productmanager: 'Quinto',
                profit: '0.00',
                fechanacimiento: '15-01-1988'
            }, {
                id: 3,
                sellingprice: '1.50',
                cost: '2.00',
                productmanager: 'Vargas',
                profit: '0.50',
            }, {
                id: 4,
                sellingprice: '1.50',
                cost: '2.50',
                productmanager: 'Hernadez',
                profit: '1.00',
            }, {
                id: 5,
                sellingprice: '4.00',
                cost: '3.00',
                productmanager: 'López',
                profit: '1.00',
            }, {
                id: 1,
                sellingprice: '2.00',
                cost: '1.20',
                productmanager: 'Pérez',
                profit: '0.80',
            }, {
                id: 2,
                sellingprice: '3.00',
                cost: '3.00',
                productmanager: 'Quinto',
                profit: '0.00',
                fechanacimiento: '15-01-1988'
            }, {
                id: 3,
                sellingprice: '1.50',
                cost: '2.00',
                productmanager: 'Vargas',
                profit: '0.50',
            }, {
                id: 4,
                sellingprice: '1.50',
                cost: '2.50',
                productmanager: 'Hernadez',
                profit: '1.00',
            }, {
                id: 5,
                sellingprice: '4.00',
                cost: '3.00',
                productmanager: 'López',
                profit: '1.00',
            }];
            $scope.headings = [{
                field: "id", title: "#", sortable: true
            }, {
                field: "sellingprice", title: "Selling Price", sortable: true
            }, {
                field: "cost", title: "Cost", sortable: true
            }, {
                field: "productmanager", title: "Product Manager", sortable: true
            }, {
                field: "profit", title: "Profit", sortable: true
            }];
            $scope.summary = [
           { name: 'total revenue', value: 12.67 },
                { name: 'profit to date', value: 12.67 },
                { name: 'cost/product', value: 1.77 },
                { name: 'total distance (mi)', value: 22.67 },
                { name: 'expected profit', value: 14.007 },
                { name: 'estimated cost', value: 1.55 }];
            $scope.barChartOptions = {
                title: {
                    text: 'Monthly Profit/Millions',
                },
                toolbox: {
                    feature: {
                        magicType: { show: true, type: ['line', 'bar'] },
                    }
                },
                legend: { show: false, data: ['Expenses'] },
                xAxis: { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
                yAxis: {
                    //  axisLabel: { formatter: '${value}' },
                },
                series: [{
                    name: 'Expenses',
                    type: 'bar',
                    data: [800, 2000, 3600, 1000, 1000, 2000, {
                        value: 500,
                        itemStyle: {
                            normal: { color: '#FFC966' }
                        }    //custom itemStyle=，applicable to the item only, see itemStyle
                    }, 2000, {
                        value: 4600,
                        itemStyle: { normal: { color: '#00CC00' } },
                    }, 1000, 1000, 2000],
                    barWidth: 20 //markLine: {
                    //    large: true,
                    //    data: [
                    //        { type: 'max', color: '#000000' },
                    //        { type: 'min', color: '#ffffff' }
                    //    ]
                    //}
                }]
            };
            $scope.lineChartOptions = {
                title: {
                    text: 'Product Margin'
                },

                legend: {
                    show: false,
                    data: ['Cash In']//, 'Cash Out']
                },
                toolbox: {

                    feature: {
                        magicType: { show: true, type: ['line', 'bar'] },
                    }
                },
                calculable: true,
                xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
                ],
                yAxis: [
                {
                    type: 'value',
                    //axisLabel: {
                    //    formatter: '$ {value}k'
                    //}
                }
                ],
                series: [
                {
                    name: 'Cash In',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 20, 11, 11, 15, 13, 12, 13, 20],
                    //markPoint: {
                    //    data: [
                    //        { type: 'max', name: 'Max' },
                    //        { type: 'min', name: 'Min' }
                    //    ]
                    //}
                },
                    //{
                    //    name: 'Cash Out',
                    //    type: 'line',
                    //    data: [11, 10, 12, 13, 13, 12, 11],
                    //    markPoint: {
                    //        data: [
                    //            { type: 'max', name: 'Max' },
                    //            { type: 'min', name: 'Min' }
                    //        ]
                    //    }
                    //}
                ]
            };
        }
    }
});


//addBarChartSeriesOptions = function (name, type, data) {
//             return {
//                 name: name,
//                 type: type,
//                 smooth: true,
//                 data: data
//             }
//         },
//         barChartOptions = {

//             xAxis: {
//                 type: 'category',
//                 boundaryGap: false,
//                 data: [],
//                 axisLine: { show: false },
//                 axisTick: { show: false },
//                 splitArea: { show: false },
//                 splitLine: { show: false },
//             },
//             yAxis: {
//                 type: 'value',

//                 axisLine: { show: false },
//                 axisTick: { show: false },
//                 splitArea: { show: false },
//                 splitLine: { show: false },
//             },
//             grid: { x: 70 },
//             visualMap: {
//                 show: false,
//                 dimension: 0,
//                 pieces: [{
//                     lt: 2,
//                     color: 'green'
//                 }, {
//                     gte: 2,
//                     lte: 2,
//                     color: 'red'
//                 }, {
//                     gt: 2,
//                     color: 'red'
//                 }]
//             },
//             series: [],
//             title: {
//                 text: 'Sales',
//             },
//             toolbox: { show: false },
//             legend: { data: ['Sales'] },
//         };
//         var getData = function (addTimeFilter) {
//             var filter = { companyids: [], outlets: [], states: [], countries: [], productCategories: [], time: 'Daily' };
//             if ($scope.filteredCompanies)
//                 filter.companyids = $scope.getSelectedCompanies();
//             if ($scope.filteredOutlets) {
//                 angular.forEach($scope.filteredOutlets, function (outlet) {
//                     if (outlet.prop == "States") {
//                         filter.states.push(outlet.value);
//                     }
//                     else if (outlet.prop == "Countries") {
//                         filter.countries.push(outlet.value);
//                     }
//                     else if (outlet.prop == "Outlets") {
//                         filter.outlets.push(outlet.value);
//                     }
//                 });
//             }
//             if ($scope.filteredProductCategories)
//                 filter.productCategories = $scope.filteredProductCategories.map(function (c) { return c.Id; });
//             if ($scope.filteredView && $scope.filteredView.length)
//                 filter.time = $scope.filteredView[0].value;

//             RevenueDataService.getCompanyRevenueGrossMargin(filter).then(function (data) {
//                 if (data.length) {
//                     var x = [], yArr = {};
//                     var props = areaChartOptions.legend.data;
//                     for (var i in data) {
//                         if (i == 0) { yArr[props[0]] = []; yArr[props[1]] = []; }
//                         yArr[props[0]].push(data[i].TotalSales);
//                         yArr[props[1]].push(data[i].GrossMargin);
//                         x.push(data[i].Time);
//                     }

//                     areaChartOptions.xAxis[0].data = x;
//                     areaChartOptions.series = [];
//                     angular.forEach(props, function (prop) {
//                         areaChartOptions.series.push(addAreaChartSeriesOptions(prop, yArr[prop]));
//                     });
//                     $scope.areaChartOptions = areaChartOptions;
//                 }
//             });

//             if (!addTimeFilter) {
//                 RevenueDataService.getCompanySales(filter).then(function (data) {
//                     if (data.length) {
//                         var x = [], yArr = {}, type = {};
//                         var props = barChartOptions.legend.data;
//                         for (var i in data) {
//                             if (i == 0) {
//                                 yArr[props[0]] = [];
//                                 type[props[0]] = 'line'
//                             }
//                             yArr[props[0]].push(data[i].TotalSales);
//                             x.push(data[i].Date);
//                         }

//                         barChartOptions.xAxis.data = x;
//                         barChartOptions.series = [];
//                         angular.forEach(props, function (prop) {
//                             barChartOptions.series.push(addBarChartSeriesOptions(prop, type[prop], yArr[prop]));
//                         });
//                         $scope.barChartOptions = barChartOptions;
//                     }
//                 });
//             }
//         }
