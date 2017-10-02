var nuageApp = angular.module('nuage', ['ui.bootstrap', 'ui.router', 'isteven-multi-select', 'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.pagination', 'ngFileUpload', 'daypilot'])
    .config(function ($stateProvider, $httpProvider, $urlRouterProvider, USER_ROLES) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);

        // Set up the URL routing in the application
        $urlRouterProvider.otherwise("/dashboard");

        // Now set up the routes
        $stateProvider
            .state('login', {
                name: "login",
                url: '/login',
                templateUrl: 'app/login/login-view.html',
                hideNavbar: true
            })
            .state('logout', {
                name: "logout",
                url: '/logout',
                templateUrl: 'app/logout/logout-view.html',
                hideNavbar: true
            })
            //.state("forbidden", {
            //    /* ... */
            //})
            .state("signUp", {
                name: "signUp",
                url: '/signUp',
                templateUrl: 'app/signup/signup-view.html',
                hideNavbar: true
            })
            //.state("admin", {
            //    /* ... */
            //    resolve: {
            //        access: ["Access", function (Access) { return Access.hasRole("ROLE_ADMIN"); }],
            //    }
            //})
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "app/dashboard/dashboard-view.html",
                controller: "dashboardCtrl",
                resolve: {
                    auth: function resolveAuthentication(AuthService) {
                        //return AuthResolver.resolve();
                        return AuthService.isAuthenticated();
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                }
            })
            .state('inventory', {
                url: "/inventory",
                templateUrl: "app/inventory/inventory-view.html",
                controller: "inventoryCtrl",
                resolve: {
                    auth: function resolveAuthentication(AuthService) {
                        //return AuthResolver.resolve();
                        return AuthService.isAuthenticated();
                    }
                },
                //resolve: {
                //    //access: ["Access", function (Access) { return Access.isAuthenticated(); }],
                //    userProfile: "UserProfile"
                //},
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                }
            })
            .state('user', {
                url: "/user",
                templateUrl: "app/user/user-view.html",
                controller: "userCtrl",
                resolve: {
                    auth: function resolveAuthentication(AuthService) {
                        //return AuthResolver.resolve();
                        return AuthService.isAuthenticated();
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                }
            })
                .state('user.requests', {
                    url: "/requests",
                    templateUrl: "app/user/requests/requestsUser-view.html",
                    controller: "requestsUserCtrl",

                })
                .state('user.profile', {
                    url: "/profile",
                    templateUrl: "app/user/profile/profileUser-view.html",
                    controller: "profileUserCtrl",

                })
            .state('company', {
                url: "/company",
                templateUrl: "app/company/company-view.html",
                controller: "companyCtrl",
                resolve: {
                    auth: function resolveAuthentication(AuthService) {
                        //return AuthResolver.resolve();
                        return AuthService.isAuthenticated();
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                }
            })
                .state('company.create', {
                    url: "/create",
                    templateUrl: "app/company/create/createCompany-view.html",
                    controller: "createCompanyCtrl",
                })
                .state('company.admin', {
                    url: "/admin",
                    templateUrl: "app/company/admin/adminCompany-view.html",
                    controller: "adminCompanyCtrl",
                })
                .state('company.roles', {
                    url: "/roles",
                    templateUrl: "app/company/roles/rolesCompany-view.html",
                    controller: "rolesCompanyCtrl",
                }).
                state('company.role', {
                    url: "/role",
                    templateUrl: "app/company/role/roleCompany-view.html",
                    controller: "roleCompanyCtrl",
                })
    })
    .run(['$location', '$rootScope', '$state', '$log', 'AUTH_EVENTS', 'AuthService',
        function ($location, $rootScope, $state, $log, AUTH_EVENTS, AuthService) {
            /*set title*/
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $rootScope.state = toState.name;
                var authorizedRoles = [];
                if (toState.data)
                    authorizedRoles = toState.data.authorizedRoles;
                if ($rootScope.state != "login" && $rootScope.state != "signUp" && $rootScope.state != "logout")
                    if (!AuthService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        if (AuthService.isAuthenticated()) {
                            // user is not allowed
                            // $state.go('login');
                            //  $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        } else {
                            // user is not logged in
                            $state.go('login');
                            //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        }
                    }
            });
            //login on refresh 
            ////login page 
            //if (!LoginService.isAuthenticated()) {
            //    $state.go('login');
            //}


            ///*Service Port Number is initialzed on runtime. The Service writes it's port number in params.js file*/
            var rootMiddleServiceHost,
                rootMiddleServicePort = "55141",
                rootMiddleServiceSSL = "false",
                httpPrefix = "http";

            rootMiddleServicePort = "57923";   //new Api
            if (!rootMiddleServiceHost) {
              //  rootMiddleServiceHost = "localhost";
                rootMiddleServiceHost = "nuageapp.azurewebsites.net";  //production environment 
            }

            var authToken = localStorage.getItem('ONLINE');

            if (!(authToken === null)) {
                var authToken = localStorage.getItem('ONLINE');
                $http.defaults.headers.common['Authorization'] = "Bearer " + authToken;
            }


            //var assignMiddleServiceParams = function () {
            //    var middleServicePortFile = new XMLHttpRequest();
            //    middleServicePortFile.open("GET", "params.js", false);
            //    middleServicePortFile.onreadystatechange = function () {
            //        if (middleServicePortFile.readyState === 4) {
            //            if (middleServicePortFile.status === 200 || middleServicePortFile.status === 0) {
            //                var params = middleServicePortFile.responseText.split(',');
            //                //var portNumber = middleServicePortFile.responseText;
            //                var portNumber = params[0].trim();
            //                var sslEnable = params[1].trim();
            //                var hostIp = params[2].trim();
            //                if (portNumber.length > 0) {
            //                    rootMiddleServicePort = portNumber;
            //                }
            //                if (sslEnable.length > 0) {
            //                    rootMiddleServiceSSL = sslEnable;
            //                    sslEnable = sslEnable.toLowerCase();
            //                    if (sslEnable === "true") {
            //                        httpPrefix = "https";
            //                    }
            //                    else {
            //                        httpPrefix = "http";
            //                    }
            //                }
            //                if (hostIp.length > 0) {
            //                    rootMiddleServiceHost = hostIp;
            //                }
            //            }
            //        }
            //    };
            //    middleServicePortFile.send(null);
            //};
            //assignMiddleServiceParams();
            // $rootScope.baseURL = httpPrefix + "://" + rootMiddleServiceHost + ":" + rootMiddleServicePort + "/api/";
            $rootScope.baseURL = httpPrefix + "://" + rootMiddleServiceHost + "/api/";       //production

         //   $rootScope.baseURL = httpPrefix + "://" + rootMiddleServiceHost + ":" + rootMiddleServicePort + "/api/";
        }]);


nuageApp.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? (input.charAt(0).toUpperCase() + input.substr(1).toLowerCase()) + ' | Nuage Pulse' : '';
    }
});