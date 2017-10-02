nuageApp.service('CashFlowDataService', ['$q', '$uibModal', '$rootScope', '$http', function ($q, $uibModal, $rootScope, $http) {

    this.chartData = {
        'Yearly': { x: ['2010', '2011', '2012', '2013', '2014', '2015'], y: [[10000, 5000, 6000, 5000, 3000, 2000, 8000], [2000, 1000, 2500, 3000, 3000, 1200, 3000]] },
        'Quarterly': { x: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'], y: [[500, 200, 50, 150], [300, 200, 30, 50]] },
        'Monthly': { x: ['Jan', 'Feb', 'Mar', 'Apr'], y: [[100, 50, 60, 50], [20, 10, 25, 30]] },
        'Daily': { x: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'], y: [[100, 50, 60, 50, 30, 20, 80, 50, 40, 30, 70, 80, 65, 100, 150, 60], [20, 10, 25, 30, 3, 12, 30, 20, 10, 50, 40, 30, 20, 50, 60, 10]] }
    }

    this.getChartData = function (filter) {
        var defer = $q.defer(),
            request = $http({
                method: 'POST',
                headers: { "content-type": "application/json", },
                url: $rootScope.baseURL + 'Liquidity/GetDataForGraph',
                data: {
                    Companies: filter.companyids,
                    Outlets: filter.outlets,
                    States: filter.states,
                    Countries: filter.countries,
                    Time: filter.time
                }
            })
            .success(function (response) {
                defer.resolve(response);
            }).error(function (reason) {
                defer.reject(reason);
            });
        return defer.promise;
    };

    this.getCashFlowData = function (filter) {
        var defer = $q.defer(),
            request = $http({
                method: 'POST',
                headers: { "content-type": "application/json", },
                url: $rootScope.baseURL + 'Liquidity/GetAmountFlowData',
                data: {
                    Companies: filter.companyids,
                    Outlets: filter.outlets,
                    States: filter.states,
                    Countries: filter.countries,
                    Time: filter.time
                }
            })
            .success(function (response) {
                defer.resolve(response);
            }).error(function (reason) {
                defer.reject(reason);
            });
        return defer.promise;
    };

    this.manageCashFlowData = function (data) {
        var that = this;
        var defer = $q.defer();
        var modalInstance = $uibModal.open({
            templateUrl: 'app/directives/cashFlow/new-attachment-tmpl.html',
            controller: 'cashFlowManagementCtrl',
            //windowClass: 'app-modal-window',
            size: 'lg',
            resolve: {
                amountPayActions: function () {
                    return data.ActionPayable || [];
                },
                amountRecvActions: function () {
                    return data.ActionReceivable || [];
                },
                statusOptions: function () {
                    return data.StatusOptions || [];
                },
                tableData: function () {
                    return data.AmountFlow || [];
                },
            }
        });

        modalInstance.result.then(function (data) {
            defer.resolve(data);
        }, function () { defer.reject(); });
        return defer.promise;
    };
    
    this.updateCashFlowData = function (cashFlowDataEntity) {
        var formattedData = {
            "Id": cashFlowDataEntity.Id || 0,
            "Name": cashFlowDataEntity.Name || "",
            "Amount": Math.abs(cashFlowDataEntity.Amount) || 0,
            "DueDate": cashFlowDataEntity.DueDate || "",
            "Date": cashFlowDataEntity.Date || "",
            "Action": cashFlowDataEntity.Action || "",
            "Status": cashFlowDataEntity.Status || "",
            "Notes": cashFlowDataEntity.Notes || "",
            "IsPayable": cashFlowDataEntity.IsPayable,
            "IsReceivable": cashFlowDataEntity.IsReceivable,
            "InitDate": cashFlowDataEntity.InitDate || ""
        }
        var defer = $q.defer(),
            request = $http({
                method: 'POST',
                headers: { "content-type": "application/json", },
                url: $rootScope.baseURL + 'Liquidity/UpdateAmount',
                data: formattedData
            })
            .success(function (response) {
                defer.resolve(response);
            }).error(function (reason) {
                defer.reject(reason);
            });
        return defer.promise;
    }

}]);