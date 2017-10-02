nuageApp.service('CompanyService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        //Role Request 
        this.requestRole = function (role) {
            var defer = $q.defer(),
                     request = $http({
                         method: 'POST',
                         headers: { "content-type": "application/json", },
                         url: $rootScope.baseURL + 'sales/GetFilteredSalesWithForcast',
                         data: role
                     })
                     .success(function (response) {
                         defer.resolve(response);
                     }).error(function (reason) {
                         defer.reject(reason);
                     });
            return defer.promise;
        };
    }]);