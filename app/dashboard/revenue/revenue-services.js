nuageApp.service('RevenueDataService', ['$rootScope', '$http', '$q',
    function ($rootScope, $http, $q) {
        this.getCompanyRevenueGrossMargin = function (filter) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'sales/GetFilteredSales',
                    data: {
                        Companies: filter.companyids,
                        Outlets: filter.outlets,
                        States: filter.states,
                        Countries: filter.countries,
                        ProductCategoryIds: filter.productCategories,
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
        this.getCompanySales = function (filter) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'sales/GetFilteredSalesWithForcast',
                    data: {
                        Companies: filter.companyids,
                        Outlets: filter.outlets,
                        States: filter.states,
                        Countries: filter.countries,
                        ProductCategoryIds: filter.productCategories
                    }
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
    }]);
