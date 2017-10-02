nuageApp.controller('SignUpController',
    function ($scope, $rootScope, AUTH_EVENTS, AuthService, $state, SignUpDataService) {
        $scope.registerError = "";
        $scope.register = {
            Email: '',
            SecretCode: '',
            confirmPassword: '',
            FirstName: '',
            LastName: '',
            ContactNumber: '',
            hearAboutUs: '',
            Active: 1,
            UserRole: {
                RoleId: 1,
                RoleName: "Admin",
                Active: 1
            }
        }
        $scope.sourceTypes = ["Google", "Facebook", "Youtube"];
        $scope.signup = function () {
            SignUpDataService.registerUser($scope.register).then(function () {
                $state.go('login');
            }, function () { });
        };
    });