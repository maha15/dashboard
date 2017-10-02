nuageApp.controller('appController', function ($scope, USER_ROLES, AuthService, Session, $state) {
    $scope.state = $state;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.authSrv = AuthService;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };
    $scope.$on('session:refreshed', function () {
        $scope.currentUser = Session;
    });
})