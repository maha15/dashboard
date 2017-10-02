nuageApp.controller('roleCompanyCtrl', ['$scope', 'MainDataService', '$q', 'CompanyService',
    function ($scope, MainDataService, $q, CompanyService) {
        $scope.var.activeTab = "role";

        var loadCompanies = function () {
            var defer = $q.defer();
            MainDataService.getCompanies().then(function (companies) {
                $scope.companies = companies;
                defer.resolve();
            }, function () {
                defer.reject();
            }); return defer.promise;

        },
        loadRoles = function () {
            var defer = $q.defer();
            MainDataService.getRoles().then(function (roles) {
                $scope.roles = roles;
                defer.resolve();
            }, function () {
                defer.reject();
            });
            return defer.promise;
        },
        isValidRoleObj = function () {
            if ($scope.role.CompanyId && $scope.role.Roles.length && $scope.role.Email && $scope.role.ContactNumber)
                return true;
            else return false;
        };

        $scope.selectedRoles = [];
        $scope.role = {
            CompanyId: 0,
            Roles: [],
            Email: '',
            ContactNumber: ''
        };
        $scope.init = function () {
            loadCompanies();
            loadRoles();
        };
        $scope.requestRole = function (request) {
            if ($scope.selectedRoles.length) {
                $scope.role.Roles = $scope.selectedRoles.map(function (r) { return r.RoleId; });
            }
            if (isValidRoleObj()) {
                CompanyService.requestRole($scope.role);
            }
        };

    }])