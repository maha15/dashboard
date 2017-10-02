nuageApp.controller('LogoutController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $state) {
    AuthService.logout();
    $state.go('login');

});