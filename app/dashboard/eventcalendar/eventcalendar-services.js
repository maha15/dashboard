nuageApp.service('EventCalendarService', ['$rootScope', '$http', '$q', '$uibModal',
    function ($rootScope, $http, $q, $uibModal) {
       
        this.getCompanyEvents = function (filter) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'events/GetEvents',
                    data: {
                        UserID: filter.userids
                    }
                })
                    .success(function (response) {
                        defer.resolve(response);
                    }).error(function (reason) {
                        defer.reject(reason);
                    });
            return defer.promise;
        };

        this.insertCompanyEvent = function (filter) {
            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'events/insertEvent',
                    data: {
                        UserID: filter.userids
                    }
                })
                    .success(function (response) {
                        defer.resolve(response);
                    }).error(function (reason) {
                        defer.reject(reason);
                    });
            return defer.promise;
        };


        this.showEvent = function () {
            var that = this;
            var defer = $q.defer();
            var modalInstance = $uibModal.open({
                templateUrl: 'app/dashboard/eventcalendar/event/event-tmpl.html',
                controller: 'eventCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (data) {
                defer.resolve(data);
            }, function () { defer.reject(); });
            return defer.promise;
        };



         this.newEventData = {yearSetCount: 0};

          this.event = function() {
                return this.newEventData;
          };

          this.setName = function(name) {
                this.newEventData.name = name;
          };

          this.getName = function() {
                return this.newEventData.name;
          };

          this.setSetCount = function(setCount) {
                this.newEventData.yearSetCount = setCount;
          };

          this.getSetCount = function() {
                return this.newEventData.yearSetCount;
          };

    }]);
