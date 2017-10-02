nuageApp.directive('dashChart', function ($window) {
    return {
        restrict: 'AE',
        scope: {
            options: '=',
            theme: '='
        },
        link: function (scope, elem, attrs) {
            // directive is called once for each chart
            var defaultOptions = {
                title: {
                    textStyle: {
                        fontWeight: "100",
                        color: "#4F5256",
                        fontFamily: "Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif"
                    }
                },
                tooltip: { trigger: 'axis' },
                legend: { y: 'bottom' },
                toolbox: {
                    orient: 'vertical',
                    y: 'center',
                    feature: {
                        //  dataView: { show: true, readOnly: false },
                        //restore: { show: true },
                        //saveAsImage: { show: true }
                    }
                }
            };
            scope.$watch('options + theme', function () {
                var myChart = echarts.init(elem[0], attrs['theme']);
                if (scope.options)
                    defaultOptions.toolbox.show = scope.options.toolbox ? true : false;
                var options = angular.merge({}, scope.options, defaultOptions)
                myChart.setOption(options);
                angular.element($window).on('resize', function () {
                    //myChart.resize();
                });
            }, true);
        }
    }
});
nuageApp.directive('multiDonuts', function ($window) {
    return {
        restrict: 'AE',
        scope: {
            chartOptions: '='
        },
        template: "<div dash-chart options='chartOptions' theme='macarons2' style='width: 100%; min-height: 250px'></div>",
        link: function (scope, elem, attrs) {

            scope.chart = null;

            //scope.$watch('chartOptions', function () {
            //}, true);

            scope.$on('change:options', function (event, options) {
                if (options) {

                    if (scope.chart)
                        scope.chart.dispose();

                    var myChart = echarts.init(elem[0], attrs['theme']);
                    myChart.setOption(options);
                    angular.element($window).on('resize', function () {
                        //  myChart.resize();
                    });

                    scope.chart = myChart;
                }

            });
        }
    }
});
nuageApp.directive("eventCalander", ['$compile', '$window', function ($compile, $window) {
    return {
        //template: "<table id='table' class='table table-responsive'></table>",
        restrict: "E",
        link: function (scope, element, attrs) {
            $("#calendar").zabuto_calendar();
        }
    }
}]);


nuageApp.directive('inventoryChart', function ($window, $rootScope) {
    return {
        restrict: 'AE',
        scope: {
            options: '=',
            theme: '='
        },
        link: function (scope, elem, attrs) {
            // directive is called once for each chart
            var defaultOptions = {
                title: {
                    textStyle: {
                        fontWeight: "100",
                        color: "#4F5256",
                        fontFamily: "Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif"
                    }
                },
                tooltip: { trigger: 'axis' },
                legend: { y: 'bottom' },
                toolbox: {
                    orient: 'vertical',
                    y: 'center',
                    feature: {
                        //  dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                }
            };
            scope.$watch('options + theme', function () {
                var myChart = echarts.init(elem[0], attrs['theme']);
                if (scope.options)
                    defaultOptions.toolbox.show = scope.options.toolbox ? true : false;
                var options = angular.merge({}, scope.options, defaultOptions)
                myChart.setOption(options);
                angular.element($window).on('resize', function () {
                    //   myChart.resize();
                });
                function eConsole(param) {
                    var selected = param.dataIndex;
                    var data = myChart._option.series[0].data;
                    angular.forEach(data, function (d, i) {
                        if (i == selected) {
                            d.itemStyle.normal.color = '#6196de';
                            var lines = myChart._option.series[0].markLine.data;
                            var md = myChart._option.markLineData;
                            if (lines.length) {
                                lines[0][0].yAxis = md.eoq[i]; lines[0][1].yAxis = md.eoq[i]; lines[0][0].value = md.eoq[i];
                                lines[1][0].yAxis = md.stock[i]; lines[1][1].yAxis = md.stock[i]; lines[1][0].value = md.stock[i];
                            }
                            else {
                                lines.push([{ name: 'EOQ', xAxis: -3, value: md.eoq[i], yAxis: md.eoq[i] }, { xAxis: 6, yAxis: md.eoq[i] }]);
                                lines.push([{ name: 'Stock holding capacity', value: md.stock[i], xAxis: -3, yAxis: md.stock[i] }, { xAxis: 6, yAxis: md.stock[i] }]);
                            }
                        }
                        else
                            d.itemStyle.normal.color = '#d3d3d3';
                    });
                    myChart.refresh();
                }

                myChart.on(echarts.config.EVENT.CLICK, eConsole);
            }, true);
        }
    }
});
nuageApp.directive('donutChart', function ($window, $rootScope) {
    return {
        restrict: 'AE',
        scope: {
            options: '=',
            theme: '=',
            selectedCategory: '='
        },
        link: function (scope, elem, attrs) {
            // directive is called once for each chart
            var defaultOptions = {
                title: {
                    textStyle: {
                        fontWeight: "100",
                        color: "#4F5256",
                        fontFamily: "Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif"
                    }
                },
                tooltip: { trigger: 'axis' },
                legend: { y: 'bottom' },
                toolbox: {
                    orient: 'vertical',
                    y: 'center',
                    feature: {
                        //  dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                }
            };

            scope.chart = null;

            scope.findIndex = function (name) {
                var data = scope.chart._model.option.series[0].data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == name)
                        return i;
                }
                return -1;
            }

            scope.$watch('options + theme', function () {
                if (scope.chart)
                    scope.chart.dispose();

                var myChart = echarts.init(elem[0], attrs['theme']);
                if (scope.options)
                    defaultOptions.toolbox.show = scope.options.toolbox ? true : false;
                var options = angular.merge({}, scope.options, defaultOptions)
                myChart.setOption(options);

                angular.element($window).on('resize', function () {
                    scope.chart.resize();
                });

                function eConsole(param) {
                    //var selected = scope.chart._model.option.series[0].data[param.dataIndex].selected;
                    //var labelShow = scope.chart._model.option.series[0].data[param.dataIndex].label.normal.show;

                    var index = scope.findIndex(scope.selectedCategory);
                    if (scope.selectedCategory != param.name && index > -1) {
                        scope.chart._model.option.series[0].data[index].selected = false;
                        scope.chart._model.option.series[0].data[index].label.normal.show = false;
                        scope.chart._model.option.series[0].data[index].label.emphasis.show = false;

                        scope.chart._model.option.series[0].data[param.dataIndex].label.normal.show = true;
                        scope.chart._model.option.series[0].data[param.dataIndex].selected = true;
                        scope.chart._model.option.series[0].data[param.dataIndex].label.emphasis.show = true;
                    }
                    if (scope.selectedCategory != param.name)
                        $rootScope.$broadcast('change:costCategory', param.name);
                    scope.selectedCategory = param.name;

                    //scope.chart.refresh();
                    if (scope.selectedCategory != param.name)
                        $rootScope.$broadcast('change:costCategory', param.name);
                    scope.selectedCategory = param.name;
                    scope.chart.resize();
                }

                myChart.on('click', function (params) { eConsole(params); });
                myChart.on('dblclick', function (params) { eConsole(params); });

                $rootScope.$broadcast('change:costCategory', scope.selectedCategory);
                scope.chart = myChart;
            }, true);
        }
    }
});

nuageApp.directive("bootstrapTable", ['$compile', '$window', '$rootScope',
    function ($compile, $window, $rootScope) {
        return {
            scope: {
                data: '=',
                headings: '=',
                tableType: '='
            },
            replace: true,
            template: "<table class='table table-responsive' width:'100%'></table>",
            restrict: "E",
            link: function (scope, element, attrs) {
                $window.onresize = function (event) {
                    element.bootstrapTable('resetView');
                };
                $rootScope.$on('refreshTable:' + scope.tableType, function (newVal, oldVal) {
                    if (element.children().length) {
                        element.bootstrapTable('refreshOptions', { 'columns': scope.headings, 'data': scope.data });
                    }
                });
                //$rootScope.$on('removeTableElement:' + scope.tableType, function (newVal, oldVal) {
                //    if (element.children().length) {
                //        element.bootstrapTable('remove', { field: 'orderid', values: [oldVal.row.orderid] });
                //    }
                //});

                scope.$watch('data + headings', function (newVal, oldVal) {
                    if (!element.children().length)
                        element.bootstrapTable({
                            data: scope.data,
                            columns: scope.headings,
                            pagination: true,
                            pageList: [5, 10, 15, 25, 50, 100, 250, 500, 1000],
                            pageSize: 5,
                            //showRefresh: true,
                            //showToggle: true,
                            sortable: true,
                            search: attrs.search ? true : false,
                            //showColumns: true,
                            //showColumn: ['id', 'primernombre'],
                            //height: 400,
                            align: 'center',
                            striped: true,
                            iconsPrefix: 'fa',
                            editable: true
                        });
                    else
                        element.bootstrapTable('refreshOptions', { 'columns': scope.headings, 'data': scope.data });

                }, true);
            }
        }
    }]);

nuageApp.directive('dropdownMultiselect', function ($document) {
    return {
        restrict: 'E',
        scope: {
            model: '=model',
            options: '=',
            pre_selected: '=preSelected'
        },
        templateUrl: "app/directives/multiselect-dropdown-tmpl.html",
        controller: function ($scope) {
            $scope.selectAll = function () {
                $scope.model.splice(0, $scope.model.length);
                for (var i in $scope.options)
                    $scope.model.push($scope.options[i]);
                console.log($scope.model);
                return false;
            };
            $scope.deselectAll = function () {
                $scope.model.splice(0, $scope.model.length);
                console.log($scope.model);
                return false;
            };
            $scope.setSelectedItem = function () {
                var id = this.option;
                pos = $scope.model.map(function (e) { return e; }).indexOf(id);
                if (pos >= 0) {
                    $scope.model.splice(pos, 1);
                }
                else {
                    $scope.model.push(id);
                }
                console.log($scope.model);
                return false;
            };
            $scope.isChecked = function (id) {
                if (_.contains($scope.model, id)) {
                    return 'glyphicon glyphicon-ok pull-right';
                }
                return false;
            };
        },
        link: function (scope, el, attr) {
            $document.on('click', function (e) {
                if (el !== e.target && !el[0].contains(e.target)) {
                    scope.$apply(function () {
                        if (scope.open === true) {
                            scope.$eval(scope.open = !scope.open);
                        }
                    });
                }
            });
        }
    }
});
