nuageApp.controller('rolesCompanyCtrl', ['$scope', function ($scope) {
    $scope.var.activeTab = "roles";
    $scope.data = [{
        id: 1,
        company: 'Nine West',
        role: 'Contributor',
        status: 'Accepted',
        date: '02/02/2017',
    }, {
        id: 2,
        company: '3.00',
        role: 'Viewer',
        status: 'Pending',
        date: '20/05/2017',
    }];
    $scope.headings = [{
        field: "id", title: "#", sortable: true
    }, {
        field: "company", title: "Company", sortable: true
    }, {
        field: "role", title: "Role", sortable: true
    }, {
        field: "status", title: "Status", sortable: true
    }, {
        field: "date", title: "Date", sortable: true
    }];
}])