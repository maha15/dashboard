nuageApp.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $state) {
    $scope.credentials = {
        UserName: '',
        password: ''
    };
    $scope.loginError = "";

    $scope.login = function (credentials) {
        $scope.loginForm.$valid = false;
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
            $state.go('dashboard');
        }, function () {
            $scope.loginError = "Incorrect username/password !";
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $scope.loginForm.$valid = true;
        });
    };
    $scope.register = function () {
        $state.go('signUp');
    };
});