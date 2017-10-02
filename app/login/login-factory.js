nuageApp.factory('AuthService', function ($http, Session, $q, $rootScope) {
    var authService = {};

    authService.login = function (credentials) {
        //var res = {
        //    data: {
        //        id: 1,
        //        user: { id: 1, role: "admin" }
        //    },
        //    name: "user"
        //};
        //Session.create(res.data.id, res.data.user.id, res.data.user.role);
        //defer.resolve(res);

        var defer = $q.defer(),
              request = $http({
                  method: 'POST',
                  headers: { "content-type": "application/json", },
                  url: $rootScope.baseURL + 'user/Login',
                  data: credentials
              })
              .success(function (response) {
                  Session.create(response);
                  Session.save(response);
                  defer.resolve(response);
              }).error(function (reason) {
                  defer.reject(reason);
              });
        return defer.promise;
    };
    authService.logout = function () {
        Session.destroy();
    };
    authService.isAuthenticated = function () {
        if (!Session.userId)
            authService.refreshSession();
        return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    authService.refreshSession = function () {
        var user = Session.get();
        if (user)
            Session.create(JSON.parse(user));
        $rootScope.$broadcast('session:refreshed', {});
    };
    return authService;
})