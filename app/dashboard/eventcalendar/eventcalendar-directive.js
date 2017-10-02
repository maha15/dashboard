/// <reference path="directive-evencalendar-tmpl.html" />
nuageApp.directive('eventcalendarDirective', ['$q', 'MainDataService', '$timeout', 'EventCalendarService', '$rootScope',
    function ($q, MainDataService, $timeout, EventCalendarService, $rootScope) {
        return {
            restrict: 'AE',
            templateUrl: 'app/dashboard/eventcalendar/directive-eventcalendar-tmpl.html',
            scope: true,
            controller: function ($scope) {



                //scope variable that will store the event calendar object
                var dispcal = $scope.week;


                //stores the events data
                $scope.events = [];


                // load events
                var loadEvents = function () {
                    $timeout(function () {
                        var params = {
                            start: $scope.week.visibleStart().toString(),
                            end: $scope.week.visibleEnd().toString()
                        }
                        // EventCalendarService.getCompanyEvents(); !!!!!!~(backend_events.php) select all events in a time range, send the params var
                        // fetch events from database
                        $scope.events = [
                            {
                                start: new DayPilot.Date(new Date()),
                                end: new DayPilot.Date(new Date()),
                                id: DayPilot.guid(),
                                text: "First Event"
                            }
                        ];
                    });
                };

                
                $scope.weekConfig = {
                    viewType: "Week",

                    onEventMove: function (args) {
                        var params = {
                            id: args.e.id(),
                            newStart: args.newStart.toString(),
                            newEnd: args.newEnd.toString()
                        };

                         // EventCalendarService.updateEvent(params); !!!!!!
                        
                    },

                    onEventResize: function (args) {
                        var params = {
                            id: args.e.id(),
                            newStart: args.newStart.toString(),
                            newEnd: args.newEnd.toString()
                        };

                         // EventCalendarService.updateEvent(params); !!!!!!

                    },

                    onEventClick: function (args) {
                        var modal = new DayPilot.Modal({
                            
                            onClosed: function (args) {
                                if (args.result) {  // args.result is empty when modal is closed without submitting
                                    loadEvents();
                                }
                            }
                        });
                        EventCalendarService.showEvent();
                    }
                };


                $scope.dayConfig = {
                    viewType: "Day",
                    visible: false,
                    onEventMove: function (args) {
                        var params = {
                            id: args.e.id(),
                            newStart: args.newStart.toString(),
                            newEnd: args.newEnd.toString()
                        };

                        // EventCalendarService.updateEvent(params); !!!!!!

                    },

                    onEventResize: function (args) {
                        var params = {
                            id: args.e.id(),
                            newStart: args.newStart.toString(),
                            newEnd: args.newEnd.toString()
                        };

                        // EventCalendarService.updateEvent(params); !!!!!!

                    },

                    onEventClick: function (args) {
                        var modal = new DayPilot.Modal({
                            onClosed: function (args) {
                                if (args.result) {  // args.result is empty when modal is closed without submitting
                                    loadEvents();
                                }
                            }
                        });
                       EventCalendarService.showEvent();
                    }
                };

                // TODO scroll to where the new event was added
                $scope.addEvent = function () {
                    EventCalendarService.showEvent();
                };

                 $rootScope.$on('eventName', function (event, args) {
                     $scope.message = args.message;
                     console.log("recieved" + $scope.message);
                     $scope.events.push(
                    {
                        start: new DayPilot.Date(new Date()),
                        end: new DayPilot.Date(new Date()),
                        id: DayPilot.guid(),
                        text: $scope.message 
                    });

                 });

                $scope.views = [ { name: 'Weekly view', value: 'Week' }, { name: 'Daily view', value: 'Day' }];

                $scope.$watch('filteredView', function (newVal, oldVal) {
                    
                    if (newVal[0].value == 'Week') { //???????
                        $scope.dayConfig.visible = false;
                        $scope.weekConfig.visible = true;
                        $scope.navigatorConfig.selectMode = "week";
                    }
                    else if (newVal[0].value == 'Day') {
                        $scope.dayConfig.visible = true;
                        $scope.weekConfig.visible = false;
                        $scope.navigatorConfig.selectMode = "day";
                    } 

                   
                   
                });

                $scope.navigatorConfig = {
                    selectMode: "day",
                    showMonths: 3,
                    skipMonths: 3,
                    onTimeRangeSelected: function (args) {
                        $scope.weekConfig.startDate = args.day;
                        $scope.dayConfig.startDate = args.day;
                        loadEvents();
                    }
                };
                
            }
        }
               
    }]);
