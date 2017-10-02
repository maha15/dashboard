nuageApp.service('FormatService', ['$rootScope', '$http', '$q', '$uibModal', 'MainDataService',
    function ($rootScope, $http, $q, $uibModal, MainDataService) {
        var that = this;
        this.getCompanyOutlets = function (outlets, format) {
            var groups = { States: [], Countries: [], Outlets: [] };
            var groupsValue = { States: [], Countries: [], Outlets: [] };
            if (format == "group") {
                angular.forEach(outlets, function (outlet) {
                    if (groups.States.indexOf(outlet.State) == -1) {
                        groups.States.push(outlet.State);
                        groupsValue.States.push(outlet.State);
                    }
                    if (groups.Countries.indexOf(outlet.Country) == -1) {
                        groups.Countries.push(outlet.Country);
                        groupsValue.Countries.push(outlet.Country);
                    }
                    if (groups.Outlets.indexOf(outlet.Name) == -1) {
                        groups.Outlets.push(outlet.Name);
                        groupsValue.Outlets.push(outlet.OutletId);
                    }

                });

                var formatted = [];
                for (var i in groups) {
                    if (groups[i].length) {
                        formatted.push({ name: '<strong>' + i + '</strong>', msGroup: true });
                        angular.forEach(groups[i], function (o, index) {
                            formatted.push({ name: o, prop: i, value: groupsValue[i][index] });
                        });
                        formatted.push({ msGroup: false });
                    }
                }
                return formatted;
            }
        };
        this.getFormattedCompanyOutelets = function (selectedCompanies) {
            var defer = $q.defer();
            MainDataService.getCompanyOutlets(selectedCompanies).then(function (outlets) {
                var outlets = that.getCompanyOutlets(outlets, 'group') || [];
                defer.resolve(outlets);
            }, function () {
                console.error('could not load company outlets');
                defer.reject();
            });
            return defer.promise;
        };
        this.getCompanyProducts = function (products, format) {
            var productsArr = [];
            angular.forEach(products, function (p) {
                productsArr.push({ Name: p.Name, Id: p.Id, CompanyId: p.CompanyId });
            });
            return productsArr;
        };
        this.getCompanyProductCategories = function (products, format) {
            var productsArr = [];
            angular.forEach(products, function (p) {
                productsArr.push({ Name: p.Name, Id: p.Id, CompanyId: p.CompanyId });
            });
            return productsArr;

        };

        this.getFormattedCostCategories = function (costCategories) {
            var formattedData = {};
            costCategories.forEach(function (obj) {
                var key = Object.keys(obj)[0];
                formattedData [key] = obj[key];
            });
            return formattedData;
        }

        this.getFormattedCostSubCategories = function (costCategories) {
            var formattedCategories = {};
            costCategories.forEach(function (costSubCategories) {
                var obj = {},
                key = Object.keys(costSubCategories)[0],
                formattedData = [];
                costSubCategories[key].forEach(function (obj) {
                    formattedData.push({ name: obj.Name, value: obj.Total });
                });
                formattedCategories[key] = formattedData;
                //formattedCategories.push(obj);
            });
            return formattedCategories;
        }

        this.getCompanyCostCentres = function (data) {
            var costCenters = data[0].CostCenters;
            var costCArr = [];
            angular.forEach(costCenters, function (c) {
                costCArr.push({ name: c });
            });

            return costCArr;

        };
        this.getInventoryLevels = function (data) {
            var fromattedData = { x: [], red: [], orange: [], green: [] };
            for (var i in data) {
                if (data[i]) {
                    fromattedData.x.push(data[i].name);
                    if (data[i].total < data[i].need) {
                        fromattedData.red.push(data[i].total);
                        fromattedData.orange.push(0);
                        fromattedData.green.push(0);
                    }
                    else if (data[i].total < data[i].enough) {
                        fromattedData.red.push(data[i].need);
                        fromattedData.orange.push(data[i].total - data[i].need);
                        fromattedData.green.push(0);
                    } else {
                        fromattedData.red.push(data[i].need);
                        fromattedData.orange.push(data[i].enough - data[i].need);
                        fromattedData.green.push(data[i].total - data[i].enough);
                    }
                }
            }
            return fromattedData;
        }


    }]);