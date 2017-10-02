nuageApp.directive('costDirective', ['$q', 'CostDataService', 'MainDataService', 'FormatService', 'UploadDocService', 'AlertMessage',
function ($q, CostDataService, MainDataService, FormatService, UploadDocService, AlertMessage) {
    return {
        restrict: 'AE',
        templateUrl: 'app/dashboard/cost/directive-cost-tmpl.html',
        scope: true,
        controller: function ($scope) {

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

            $scope.loadCompanyCostCentres = function (selectedCompanies) {
                var defer = $q.defer();
                MainDataService.getCompanyCostCentres(selectedCompanies).then(function (data) {
                    $scope.costCentres = [];
                    if (data.length) {
                        $scope.costCentres = FormatService.getCompanyCostCentres(data) || [];
                    }
                    defer.resolve();
                }, function () {
                    console.error('could not load company Cost Centres');
                    defer.reject();
                });
                return defer.promise;
            };

            $scope.getSelectedCostCenters = function () {
                var selectedCostCenters = [];
                //if (!($scope.filteredCostCentres && $scope.filteredCostCentres.length)) {
                //    $scope.filteredCostCentres = [$scope.costCentres[0]];
                //}

                selectedCostCenters = $scope.filteredCostCentres.map(function (c) { return c.name; });

                return selectedCostCenters;
            }
            $scope.init = function () {
                $scope.loadCompanyOutlets([4]);
                $scope.loadCompanyCostCentres([4]);
            }

          //  $scope.$watch('companyId', function (newVal, oldVal) {
           //     if (newVal >= 0)
           //         $scope.loadCompanyOutlets(newVal);
           //         $scope.loadCompanyCostCentres(newVal);
          //  }, true);
        },
        link: function ($scope, elem, attrs) {

            $scope.views = [{ name: 'Yearly view', value: 'Yearly' }, { name: 'Monthly view', value: 'Monthly' }, { name: 'Daily view', value: 'Daily' }];
            $scope.costCategories = null;
            $scope.selectedCostCategory = null;
            $scope.costSubCategories = null;
            var donutChartOptions = {
                title: {
                    text: 'Total Cost',
                    subtext: '',
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'bottom',
                    data: []
                },
                calculable: true,
                series: [
                {
                    type: 'pie',
                    radius: ['70%', '90%'],
                    selectedMode: 'single',
                    tooltip: {
                        trigger: 'item',
                        formatter: "$ {c}k ({d}%)"
                    },
                    itemStyle: {
                        normal: {
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: []
                }
                ]
            };

            $scope.$watch('filteredView', function (newVal, oldVal) {
                if (newVal && newVal[0] && newVal[0].value) {
                    setDonutChart(newVal[0].value);
                }
                else {
                    setDonutChart('Yearly');
                }
            });

            $scope.$watch('filteredOutlets + filteredCostCentres', function (newVal, oldVal) {
                //if ($scope.filteredOutlets && $scope.filteredOutlets.length) {
                //    setDonutChart($scope.filteredOutlets[$scope.filteredOutlets.length - 1].prop);
                //}
                //else if ($scope.filteredCostCentres && $scope.filteredCostCentres.length) {
                //    setDonutChart($scope.filteredCostCentres[$scope.filteredCostCentres.length - 1].name);
                //}
                //else {
                setDonutChart('Yearly');
                //}
            }, true);

            var setDonutChart = function (interval) {
                var filter = { companyids: [], outlets: [], states: [], countries: [], costCenters: [], time: 'Yearly' };
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
                if ($scope.filteredCostCentres && $scope.filteredCostCentres.length) {
                    filter.costCenters = $scope.getSelectedCostCenters();
                }
                if ($scope.filteredView && $scope.filteredView.length)
                    filter.time = $scope.filteredView[0].value || 'Yearly';
                CostDataService.getFilteredCostData(filter).then(function (costData) {
                    var costCategories = [], costSubCategories = [];
                    if (costData.length) {
                        costData.forEach(function (obj) {
                            var catName = obj.Name;
                            var c = {}, sc = {};
                            c[catName] = obj.Total;
                            sc[catName] = obj.SubCategories;
                            costCategories.push(c);
                            costSubCategories.push(sc);
                        })
                        $scope.costCategories = FormatService.getFormattedCostCategories(costCategories);
                        $scope.costSubCategories = FormatService.getFormattedCostSubCategories(costSubCategories);
                        //$scope.selectedCostCategory = costCategories[0];

                        //$scope.costSubCategories = costData.data[1];

                        var categoryData = $scope.costCategories;

                        donutChartOptions.series[0].data = [];
                        var total = 0;
                        Object.keys(categoryData).forEach(function (key) {

                            if (!$scope.selectedCostCategory) //Initially when there's no prev data
                                $scope.selectedCostCategory = key;

                            var selected = false;
                            if ($scope.selectedCostCategory == key)
                                selected = true;
                            total = total + categoryData[key];

                            var data = setDonutChartData(key, categoryData[key], selected)
                            donutChartOptions.series[0].data.push(data);
                        });
                        //categoryData.forEach(function (obj) {
                        //    var key = Object.keys(obj)[0];

                        //    if (!$scope.selectedCostCategory) //Initially when there's no prev data
                        //        $scope.selectedCostCategory = key;

                        //    var selected = false;
                        //    if ($scope.selectedCostCategory == key)
                        //        selected = true;
                        //    total = total + obj[key];

                        //    var data = setDonutChartData(key, obj[key], selected)
                        //    donutChartOptions.series[0].data.push(data);
                        //});
                        donutChartOptions.title.text = 'Total Cost: $ ' + total + 'k';
                        donutChartOptions.legend.data = Object.keys(categoryData);
                        $scope.donutChartOptions = donutChartOptions;
                    }
                });
            }

            var setDonutChartData = function (categoryName, categoryValue, s) {
                return {
                    name: categoryName, value: categoryValue, selected: s,
                    label: {
                        normal: {
                            show: s,
                            position: 'center',
                            formatter: "{c}k ({d}%)",
                            textStyle: {
                                color: '#6C7177', fontSize: '15'
                            }
                        },
                        emphasis: {
                            show: s,
                            position: 'center',
                            formatter: "{c}k ({d}%)",
                            textStyle: {
                                color: '#6C7177', fontSize: '15'
                            }
                        }
                    }
                };
            };

            $scope.$on('change:costCategory', function (event, val) {
                if (val) {
                    switchMultipleDonutChartOptions(val);
                    $scope.$broadcast('change:options', $scope.donutSalaryBonusTravelBenefitCostOptions);
                }
            });

            $scope.setMultipleDonutChartOptions = function (legendData, data) {

                $scope.donutSalaryBonusTravelBenefitCostOptions = {
                    title: {
                        text: 'Cost Breakdown(%)',
                        textStyle: {
                            fontWeight: "100",
                            color: "#4F5256",
                            fontFamily: "Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif"
                        }
                    },
                    legend: {
                        data: legendData,//['Salary', 'Bonus', 'Travel', 'Benefits'],
                        show: false
                    },
                    series: data
                };
            }

            var switchMultipleDonutChartOptions = function (category) {
                var labelTop = {
                    normal: {
                        label: {
                            show: true,
                            position: 'center',
                            formatter: '{b}\n{d}',
                        },
                        labelLine: {
                            show: false
                        }
                    }
                };
                var labelBottom = {
                    normal: {
                        color: '#ccc',
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false
                        }
                    }
                };
                var radius = ['48%', '55%'];
                var donutChartCenters = [['12%', '50%'], ['37%', '50%'], ['62%', '50%'], ['87%', '50%']];

                var options = $scope.costSubCategories[category];
                options.sort(function (a, b) {
                    return b.value - a.value
                });

                var series = [];
                var legendData = [];
                var totalVal = $scope.costCategories[category];
                for (var i = 0; i < options.length && i < 4; i++) {
                    legendData.push(options[i].name);
                    var val = parseFloat(100 * options[i].value / totalVal).toFixed(2);
                    var data = {
                        type: 'pie',
                        center: donutChartCenters[i],
                        radius: radius, startAngle: 0,
                        data: [
                        { name: 'total', value: (100 - val), itemStyle: labelBottom },
                            { name: options[i].name, value: val, itemStyle: labelTop }
                        ]
                    };
                    series.push(data);
                }

                $scope.setMultipleDonutChartOptions(legendData, series);

            }

            $scope.addAttachment = function () {
                UploadDocService.uploadDocs().then(function (file) {
                    AlertMessage.success("File added successfully");
                }, function () {
                });
            }
        }
    }
}]);