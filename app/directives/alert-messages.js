nuageApp.directive('alertslist', ['$compile', '$rootScope', function ($compile, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            message: "="
        },
        template: '<div class="alertsList"></div>',
        link: function ($scope, $element, attrs) {

            $scope.$on('onAlterMessage', function (event, newVal) {
                if (newVal && newVal != '') {
                    var newElement = $compile("<div alertdirective message='" + newVal.msg + "' alertclass='" + newVal.msgclass + "' heading='" + newVal.type + "' is-timer-added='" + newVal.addTimer + "' interval='" + newVal.interval + "'></div>")($scope);
                    $element.children().append(newElement);
                    $scope.message = '';
                }
            });
            //$scope.$on('onProgress', function (event, newVal) {
            //    if (newVal && newVal != '') {
            //        progressBar = $('#progress-bar');
            //        if (!progressBar.length) {
            //            var newElement = $compile("<div progressalertdirective id='progress-bar' message='" + newVal.msg + "' value='" + newVal.value + "' wait='" + newVal.wait + "' alertclass='" + newVal.msgclass + "' heading='" + newVal.type + "'></div>")($scope);
            //            $element.children().append(newElement);
            //            $scope.message = '';
            //        } else {
            //            $scope.message = '';
            //            $rootScope.$broadcast('onProgressChange', {
            //                message: newVal.msg,
            //                value: newVal.value,
            //                wait: newVal.wait,
            //                alertclass: newVal.msgclass,
            //                heading: newVal.type
            //            });
            //        }

            //    }
            //});
        }
    }
}]);
nuageApp.directive('alertdirective', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            message: "@message",
            alertclass: "@alertclass",
            heading: "@heading",
            interval: "@interval",
            isTimerAdded: "@isTimerAdded"
        },
        template: '<div class="alert alert-{{alertclass}}" >' +
                  '<button type="button" class="close" ng-click="removeMsg()" >×</button>' +
                  '<strong>{{heading}}!</strong> ' +
                  '<span ng-repeat="msg in (message | newlines) track by $index">' +
                  '<p> {{msg}}</p>' +
                  '</span>' +
                  '</div>',
        link: function ($scope, element, attrs) {
            $scope.removeMsg = function () {
                element.remove();
            };
            if ($scope.isTimerAdded === "true") {
                var timer = $timeout(function () {
                    element.remove();
                }, $scope.interval ? $scope.interval : 7000);
            }
            element.on('$destroy', function () {
                $scope.$destroy();
                $timeout.cancel(timer);
            });
        }
    }
});
nuageApp.filter('newlines', function () {
    return function (text) {
        return text ? text.split(/\n/g) : [];
    };
});