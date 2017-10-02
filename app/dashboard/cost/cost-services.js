
nuageApp.service('CostDataService', ['$rootScope', '$http', '$q',
    function ($rootScope, $http, $q) {
        this.getFilteredCostData = function (filter) {
            //var deferred = $q.defer();
            //var data = {
            //    'Yearly': {
            //        time: 'yearly', data: [{ 'Head Count Cost': 800, 'Travel': 650, 'Profesional Services': 300 },
            //                               {
            //                                   'Head Count Cost': [
            //                                       { 'name': 'Salary', 'value': 50 },
            //                                       { 'name': 'Bonus', 'value': 60 },
            //                                       { 'name': 'Insurance', 'value': 20 },
            //                                       { 'name': 'Overtime', 'value': 10 },
            //                                   ],
            //                                   'Travel': [
            //                                       { 'name': 'Lodging', 'value': 60 },
            //                                       { 'name': 'Meals', 'value': 55 },
            //                                       { 'name': 'Entertainment', 'value': 45 },
            //                                   ],
            //                                   'Profesional Services': [
            //                                       { 'name': 'Consulting', 'value': 20 },
            //                                       { 'name': 'Outside Services', 'value': 70 },
            //                                       { 'name': 'Outsource People', 'value': 50 },
            //                                       { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                                   ]
            //                               }]
            //    },
            //    'Monthly': {
            //        time: 'monthly', data: [{ 'Head Count Cost': 100, 'Travel': 150, 'Profesional Services': 30 },
            //                               {
            //                                   'Head Count Cost': [
            //                                       { 'name': 'Salary', 'value': 50 },
            //                                       { 'name': 'Bonus', 'value': 15 },
            //                                       { 'name': 'Insurance', 'value': 20 },
            //                                       { 'name': 'Overtime', 'value': 10 },
            //                                   ],
            //                                   'Travel': [
            //                                       { 'name': 'Lodging', 'value': 60 },
            //                                       { 'name': 'Meals', 'value': 55 },
            //                                       { 'name': 'Entertainment', 'value': 45 },
            //                                   ],
            //                                   'Profesional Services': [
            //                                       { 'name': 'Consulting', 'value': 20 },
            //                                       { 'name': 'Outside Services', 'value': 70 },
            //                                       { 'name': 'Outsource People', 'value': 50 },
            //                                       { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                                   ]
            //                               }]
            //    },
            //    'Weekly': {
            //        time: 'weekly', data: [{ 'Head Count Cost': 50, 'Travel': 160, 'Profesional Services': 200 },
            //                               {
            //                                   'Head Count Cost': [
            //                                       { 'name': 'Salary', 'value': 50 },
            //                                       { 'name': 'Bonus', 'value': 10 },
            //                                       { 'name': 'Insurance', 'value': 20 },
            //                                       { 'name': 'Overtime', 'value': 10 },
            //                                   ],
            //                                   'Travel': [
            //                                       { 'name': 'Lodging', 'value': 5 },
            //                                       { 'name': 'Meals', 'value': 55 },
            //                                       { 'name': 'Entertainment', 'value': 45 },
            //                                   ],
            //                                   'Profesional Services': [
            //                                       { 'name': 'Consulting', 'value': 20 },
            //                                       { 'name': 'Outsource People', 'value': 50 }
            //                                   ]
            //                               }]
            //    },
            //    'Daily': {
            //        time: 'daily', data: [{ 'Head Count Cost': 25, 'Travel': 40 },
            //                               {
            //                                   'Head Count Cost': [
            //                                       { 'name': 'Overtime', 'value': 25 },
            //                                   ],
            //                                   'Travel': [
            //                                       { 'name': 'Meals', 'value': 25 },
            //                                       { 'name': 'Entertainment', 'value': 15 },
            //                                   ]
            //                               }]
            //    },

            //    'R&D': {
            //        data: [{ 'Head Count Cost': 200, 'Profesional Services': 300 },
            //                       {
            //                           'Head Count Cost': [
            //                               { 'name': 'Salary', 'value': 50 },
            //                               { 'name': 'Bonus', 'value': 60 },
            //                               { 'name': 'Overtime', 'value': 10 },
            //                           ],
            //                           'Profesional Services': [
            //                               { 'name': 'Consulting', 'value': 20 },
            //                               { 'name': 'Outside Services', 'value': 70 },
            //                               { 'name': 'Outsource People', 'value': 50 },
            //                               { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                           ]
            //                       }]
            //    }, 'HR': {
            //        data: [{ 'Head Count Cost': 200, 'Travel': 10, 'Profesional Services': 300 },
            //                                 {
            //                                     'Head Count Cost': [
            //                                         { 'name': 'Salary', 'value': 50 },
            //                                         { 'name': 'Bonus', 'value': 60 },
            //                                         { 'name': 'Insurance', 'value': 20 },
            //                                     ],
            //                                     'Travel': [
            //                                         { 'name': 'Lodging', 'value': 60 },
            //                                         { 'name': 'Meals', 'value': 55 },
            //                                         { 'name': 'Entertainment', 'value': 45 },
            //                                     ],
            //                                     'Profesional Services': [
            //                                         { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                                     ]
            //                                 }]
            //    }, 'Training': {
            //        data: [{ 'Head Count Cost': 100, 'Profesional Services': 300 },
            //                     {
            //                         'Head Count Cost': [
            //                             { 'name': 'Salary', 'value': 50 },
            //                             { 'name': 'Bonus', 'value': 60 },
            //                             { 'name': 'Insurance', 'value': 20 },
            //                             { 'name': 'Overtime', 'value': 10 },
            //                         ],
            //                         'Profesional Services': [
            //                               { 'name': 'Consulting', 'value': 20 },
            //                               { 'name': 'Outside Services', 'value': 70 },
            //                               { 'name': 'Outsource Mgmt.', 'value': 50 }
            //                         ]
            //                     }]
            //    }, 'Countries': {
            //        data: [{ 'Head Count Cost': 500, 'Travel': 300, 'Profesional Services': 400 },
            //                     {
            //                         'Head Count Cost': [
            //                             { 'name': 'Salary', 'value': 50 },
            //                             { 'name': 'Bonus', 'value': 60 },
            //                             { 'name': 'Insurance', 'value': 20 },
            //                             { 'name': 'Overtime', 'value': 10 },
            //                         ],
            //                         'Travel': [
            //                             { 'name': 'Lodging', 'value': 60 },
            //                             { 'name': 'Meals', 'value': 55 },
            //                             { 'name': 'Entertainment', 'value': 45 },
            //                         ],
            //                         'Profesional Services': [
            //                             { 'name': 'Consulting', 'value': 20 },
            //                             { 'name': 'Outside Services', 'value': 70 },
            //                             { 'name': 'Outsource People', 'value': 50 },
            //                             { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                         ]
            //                     }]
            //    }, 'States': {
            //        data: [{ 'Head Count Cost': 350, 'Travel': 200, 'Profesional Services': 300 },
            //                     {
            //                         'Head Count Cost': [
            //                             { 'name': 'Salary', 'value': 50 },
            //                             { 'name': 'Bonus', 'value': 60 },
            //                             { 'name': 'Insurance', 'value': 20 },
            //                             { 'name': 'Overtime', 'value': 10 },
            //                         ],
            //                         'Travel': [
            //                             { 'name': 'Lodging', 'value': 60 },
            //                             { 'name': 'Meals', 'value': 55 },
            //                             { 'name': 'Entertainment', 'value': 45 },
            //                         ],
            //                         'Profesional Services': [
            //                             { 'name': 'Consulting', 'value': 20 },
            //                             { 'name': 'Outside Services', 'value': 70 },
            //                             { 'name': 'Outsource People', 'value': 50 },
            //                             { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                         ]
            //                     }]
            //    }, 'Outlets': {
            //        data: [{ 'Head Count Cost': 150, 'Travel': 100, 'Profesional Services': 200 },
            //                     {
            //                         'Head Count Cost': [
            //                             { 'name': 'Salary', 'value': 50 },
            //                             { 'name': 'Bonus', 'value': 60 },
            //                             { 'name': 'Insurance', 'value': 20 },
            //                             { 'name': 'Overtime', 'value': 10 },
            //                         ],
            //                         'Travel': [
            //                             { 'name': 'Lodging', 'value': 60 },
            //                             { 'name': 'Meals', 'value': 55 },
            //                             { 'name': 'Entertainment', 'value': 45 },
            //                         ],
            //                         'Profesional Services': [
            //                             { 'name': 'Consulting', 'value': 20 },
            //                             { 'name': 'Outside Services', 'value': 70 },
            //                             { 'name': 'Outsource People', 'value': 50 },
            //                             { 'name': 'Outsource Mgmt.', 'value': 60 }
            //                         ]
            //                     }]
            //    }
            //}
            //deferred.resolve(data[time]);
            //return deferred.promise;

            var defer = $q.defer(),
                request = $http({
                    method: 'POST',
                    headers: { "content-type": "application/json", },
                    url: $rootScope.baseURL + 'Expanses/GetCost',
                    data: {
                        CompanyIds: filter.companyids,
                        OutletIds: filter.outlets,
                        States: filter.states,
                        Countries: filter.countries,
                        CostCenters: filter.costCenters,
                        Time: filter.time
                    }
                })
                .success(function (response) {
                    defer.resolve(response);
                }).error(function (reason) {
                    defer.reject(reason);
                });
            return defer.promise;
        }
    }]);