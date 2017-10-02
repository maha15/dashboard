
nuageApp.service('SignUpDataService', ['$rootScope', '$http', '$q', '$uibModal',
    function ($rootScope, $http, $q, $uibModal) {
        var that = this;

        this.registerUser = function (user) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'user/UserSignUp',
                    data: user
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
    }]);
