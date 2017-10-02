nuageApp.service('MainDataService', ['$rootScope', '$http', '$q',
    function ($rootScope, $http, $q) {

        this.getCompanies = function () {
            var defer = $q.defer(),
                request = $http.get($rootScope.baseURL + 'companies/GetAll')
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    console.error('could not load companies');
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getRoles = function () {
            var defer = $q.defer();//,
            request = $http.get($rootScope.baseURL + 'user/GetAllRoles')
            .success(function (response) {
                defer.resolve(response);
            }).error(function (reason) {
                console.error('could not load roles');
                defer.reject(reason);
            });
            // defer.resolve([{ RoleId: 1, Name: 'Contributor' }, { RoleId: 2, Name: 'Viewer' }]);
            return defer.promise;

        };
        this.getCompanyCostCentres = function (companyIDs) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'Expanses/GetCostCentersForCompanies',
                    data: companyIDs
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getCompanyOutlets = function (companyIDs) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'outlets/GetOutletsForCompanies',
                    data: companyIDs
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getCompanyProducts = function (companyIDs) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'products/GetProductCategories',
                    data: companyIDs
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        this.getCompanyProductCategories = function (companyIDs) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'products/GetProductCategories',
                    data: companyIDs
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        };
        //this.costCentre = [
        //    { name: 'R&D' },
        //    //{ name: 'Marketing' },
        //    //{ name: 'Support' },
        //    { name: 'HR' },
        //    { name: 'Training' },
        //];
        this.actualForecast = function (time) {
            var defer = $q.defer(),
                data = {
                    'Yearly': {
                        time: 'yearly', data: [{ time: '2009', uniques: 8000, recurrent: 5000 },
                            { time: '2010', uniques: 10000, recurrent: 15000 },
                            { time: '2011', uniques: 15000, recurrent: 8000 },
                            { time: '2012', uniques: 9000, recurrent: 6000 },
                            { time: '2013', uniques: 6000, recurrent: 9500 },
                            { time: '2014', uniques: 8000, recurrent: 7600 },
                            { time: '2015', uniques: 9500, recurrent: 10000 },
                            { time: '2016', uniques: 11500, recurrent: 12000 }
                        ]
                    },
                    'Monthly': {
                        time: 'monthly', data: [{ time: 'Jan', uniques: 800, recurrent: 950 },
                            { time: 'Feb', uniques: 1000, recurrent: 1100 },
                            { time: 'Mar', uniques: 800, recurrent: 950 },
                            { time: 'Apr', uniques: 950, recurrent: 950 },
                            { time: 'May', uniques: 1100, recurrent: 1100 },
                            { time: 'Jun', uniques: 1500, recurrent: 1500 },
                            { time: 'Jul', uniques: 900, recurrent: 900 },
                            { time: 'Aug', uniques: 600, recurrent: 800 },
                            { time: 'Sep', uniques: 800, recurrent: 1000 },
                            { time: 'Oct', uniques: 950, recurrent: 800 },
                            { time: 'Nov', uniques: 1100, recurrent: 600 },
                            { time: 'Dec', uniques: 950, recurrent: 800 },
                        ]
                    }
                }
            defer.resolve(data[time]);
            return defer.promise;
        }
    }]);
nuageApp.service('UploadDocService', ['$q', '$uibModal', function ($q, $uibModal) {
    this.uploadDocs = function () {
        var that = this;
        var defer = $q.defer();
        var modalInstance = $uibModal.open({
            templateUrl: 'app/directives/upload-docs-tmpl.html',
            controller: 'uploadDocsCtrl',
            size: 'md'
        });

        modalInstance.result.then(function (data) {
            //ToDo: Email it to Nuage Service
            console.log("In file serrvice data is" + data);

            defer.resolve(data);
        }, function () { defer.reject(); });
        return defer.promise;
    };
}]);

