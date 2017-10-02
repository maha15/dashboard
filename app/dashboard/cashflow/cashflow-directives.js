/// <reference path="directive-cashflow-tmpl.html" />
nuageApp.directive('cashflowDirective', ['$q', 'CashFlowDataService', 'MainDataService', 'FormatService', 'UploadDocService','AlertMessage',
 function ($q, CashFlowDataService, MainDataService, FormatService, UploadDocService, AlertMessage) {
    return {
        restrict: 'AE',
        templateUrl: 'app/dashboard/cashflow/directive-cashflow-tmpl.html',
        scope: true,
        controller: function ($scope) {
            $scope.views = [{ name: 'Yearly view', value: 'Yearly' }, { name: 'Quarterly view', value: 'Quarterly' }, { name: 'Monthly view', value: 'Monthly' }, { name: 'Daily view', value: 'Daily' }];

            $scope.loadCompanyOutlets = function (selectedCompanies) {
                var defer = $q.defer();
                MainDataService.getCompanyOutlets(selectedCompanies).then(function (outlets) {
                    $scope.rawOutlets = outlets;
                    $scope.outlets = FormatService.getCompanyOutlets(outlets, 'group') || [];
                    defer.resolve();
                }, function () {
                    console.error('could not load company outlets');
                    defer.reject();
                });
                return defer.promise;
            };

            $scope.init = function () {
                $scope.cashIn = 0;
                $scope.cashOut = 0;
                $scope.netCash = 0;
                $scope.loadCompanyOutlets([4]);
            }
        },
        link: function ($scope, elem, attrs) {

            $scope.lineChartOptions = null;

            //  $scope.cashData = [
            //{ id: 1, name: 'Sadia', status: 2, group: 4, initDate: '2016-01-02', dueDate: '2017-01-02', amount: '12', pay: '', date: '', notes: '' },
            //      { id: 2, name: 'Sana', status: undefined, group: 3, initDate: '2016-02-04', dueDate: '2017-01-02', amount: '2000', pay: '', date: '', notes: '' },
            //      { id: 3, name: 'Aimen', status: 1, group: null, initDate: '2016-03-09', dueDate: '2017-01-02', amount: '-300', pay: '', date: '', notes: '' },
            //      { id: 4, name: 'Saad', status: 1, group: null, initDate: '2016-03-09', dueDate: '2017-02-05', amount: '500', pay: '', date: '', notes: '' },
            //      { id: 5, name: 'Faraz', status: 1, group: null, initDate: '2017-01-01', dueDate: '2017-12-31', amount: '300', pay: '', date: '', notes: '' },
            //      { id: 6, name: 'Imran', status: 1, group: null, initDate: '2016-11-01', dueDate: '2016-01-31', amount: '-4', pay: '', date: '', notes: '' },
            //      { id: 7, name: 'Aimen', status: 1, group: null, initDate: '2016-11-01', dueDate: '2017-01-16', amount: '10', pay: '', date: '', notes: '' },
            //      { id: 8, name: 'Asim', status: 1, group: null, initDate: '2016-04-09', dueDate: '2017-02-02', amount: '5000', pay: '', date: '', notes: '' },
            //      { id: 9, name: 'Asif', status: 1, group: null, initDate: '2016-03-13', dueDate: '2017-03-02', amount: '-800', pay: '', date: '', notes: '' },
            //      { id: 3, name: 'Aimen', status: 1, group: null, initDate: '2016-03-09', dueDate: '2017-01-02', amount: '-300', pay: '', date: '', notes: '' },
            //  ];

            $scope.cashManagement = function () {
                var filter = { companyids: [], outlets: [], states: [], countries: [], time: 'Yearly' };
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
                CashFlowDataService.getCashFlowData(filter).then(function (data) {
                    var filteredData = [];
                    angular.forEach(data.AmountFlow, function (obj) {
                        if (parseInt(obj['Amount'])) {
                            var obj1 = obj;
                            if (obj1['IsPayable'])
                                obj1['Amount'] = -1 * parseInt(obj1['Amount']);
                            filteredData.push(obj1);
                        }
                    });
                    data.AmountFlow = filteredData;
                    CashFlowDataService.manageCashFlowData(data).then(function (data) {
                        //var totalCashIn = 0, totalCashOut = 0, net = 0;
                        //angular.forEach(data, function (obj) {
                        //    if (parseInt(obj['Amount'])) {
                        //        if (obj['IsPayable'])
                        //            totalCashOut = totalCashOut + obj.Amount;
                        //        else
                        //            totalCashIn = totalCashIn + obj.Amount;
                        //    }
                        //});
                        //totalCashOut = parseInt(totalCashOut);
                        //net = totalCashIn + totalCashOut;
                        //$scope.cashIn = parseInt(totalCashIn);
                        //$scope.cashOut = parseInt(-1 * totalCashOut);
                        //$scope.netCash = parseInt(net);
                        //$scope.cashData = data;
                    }, function () {
                    });
                });

            }

            $scope.addAttachment = function () {
                UploadDocService.uploadDocs().then(function (file) {
                    AlertMessage.success("File added successfully");
                }, function () {
                });
            }

            lineChartOptions = {
                title: { text: 'Forecast cash in and out', },
                legend: { data: ['Net Cash', 'Cash In', 'Cash Out'] },
                toolbox: {
                    feature: {
                        magicType: { show: false, type: ['line', 'bar'] },
                    }
                },
                xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitArea: { show: false },
                    splitLine: { show: false },
                }
                ],
                yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '$ {value}k'
                    },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitArea: { show: false },
                    splitLine: { show: false },
                }
                ],
                series: [
                {
                    name: 'Net Cash',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 3
                            }
                        }
                    },
                    data: [],
                    markPoint: {
                        data: [
                        { type: 'max', name: 'Max' },
                          { type: 'min', name: 'Min' }
                        ]
                    }
                },
                {
                    name: 'Cash In',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                type: 'dotted',
                                width: 0.5
                            }
                        }
                    },
                    data: []
                },
                {
                    name: 'Cash Out',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                type: 'dotted',
                                width: 0.5
                            }
                        }
                    },
                    data: [],

                }
                ]
            };

            var getData = function (defaultVal) {
                var filter = { companyids: [], outlets: [], states: [], countries: [], time: 'Yearly' };
                if ($scope.filteredCompanies || ($scope.companies && $scope.companies.length))
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
                if ($scope.filteredView && $scope.filteredView.length)
                    filter.time = $scope.filteredView[0].value || 'Yearly';
                CashFlowDataService.getChartData(filter).then(function (data) {
                    if (data.length) {
                        var totalCashIn = 0, totalCashOut = 0, net = 0;
                        var x = [], y = { NetCash: [], CashIn: [], CashOut: [] };
                        for (var i in data) {
                            y.NetCash.push(data[i].NetCash);
                            net = net + data[i].NetCash;

                            y.CashIn.push(data[i].CashIn);
                            totalCashIn = totalCashIn + data[i].CashIn;

                            y.CashOut.push(data[i].CashOut);
                            totalCashOut = totalCashOut + data[i].CashOut;

                            x.push(data[i].Time);
                        }
                        lineChartOptions.xAxis[0].data = x;

                        lineChartOptions.series[0].data = y.NetCash;
                        lineChartOptions.series[1].data = y.CashIn;
                        lineChartOptions.series[2].data = y.CashOut;

                        $scope.cashIn = parseInt(totalCashIn);
                        $scope.cashOut = parseInt(totalCashOut);
                        $scope.netCash = parseInt(net);

                        $scope.lineChartOptions = lineChartOptions;
                    }
                    else
                        $scope.lineChartOptions = lineChartOptions;

                });
            }

            $scope.$watch('filteredCompanies + filteredOutlets', function (newVal, oldVal) {
                getData();
            }, true);

            $scope.$watch('filteredView', function () {
                getData();
            }, true);
        }
    }
}]);
