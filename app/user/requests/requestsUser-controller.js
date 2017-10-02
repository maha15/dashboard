nuageApp.controller('requestsUserCtrl', ['$scope', function ($scope) {
    $scope.var.activeTab = "requests";
    $scope.data = [{
        id: 1,
        name: 'Aimen',
        email: 'aimen@abc.com',
        company: 'Nine West',
        role: 'Contributor',
        date: '02/02/2017',
    }, {
        id: 2,
        name: 'Myra',
        email: 'Myra@abc.com',
        company: 'Nike',
        role: 'Viewer',
        date: '20/05/2017',
    }];
    var actionEvents = {
        'click .ok': function (e, value, row, index) {
           // $rootScope.$emit('inventory:orderStatusClose', index);
        },
        'click .remove': function (e, value, row, index) {
           // $rootScope.$emit('inventory:orderStatusCancel', index);
        }
    },
    actionFormatter = function (value, row, index) {
        return '<button type="button" class="btn btn-sm btn-success ripple ok ml10" title="Close"><span class="glyphicon glyphicon-ok"></span></button>' +
      '<button type="button" class="btn btn-sm btn-warning ripple remove ml10" title="Cancel"><span class="glyphicon glyphicon-remove"></span></button>';
    };
    $scope.headings = [{ field: "id", title: "#", sortable: true },
        { field: "name", title: "User Name", sortable: true },
        { field: "email", title: "Email", sortable: true },
        { field: "company", title: "Company", sortable: true },
        { field: "role", title: "Role", sortable: true },
        { field: "date", title: "Date", sortable: true },
        { title: "Action", formatter: actionFormatter, events: actionEvents }];
}]);
