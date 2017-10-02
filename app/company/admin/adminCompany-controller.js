nuageApp.controller('adminCompanyCtrl', ['$scope', function ($scope) {
    $scope.var.activeTab = "admin";

    $scope.data = [{
        id: 1,
        name: '2.00',
        taxRefNo: '1.20',
        salesRefNo: 'Pérez',
        payrolRefNo: '0.80',
        noOfEmp:100
    }, {
        id: 2,
        name: '3.00',
        taxRefNo: '3.00',
        salesRefNo: 'Quinto',
        payrolRefNo: '0.00',
        noOfEmp: 100
    }, {
        id: 3,
        name: '1.50',
        taxRefNo: '2.00',
        salesRefNo: 'Vargas',
        payrolRefNo: '0.50',
        noOfEmp: 100
    }, {
        id: 4,
        name: '1.50',
        taxRefNo: '2.50',
        salesRefNo: 'Hernadez',
        payrolRefNo: '1.00',
        noOfEmp: 100
    }];
    $scope.headings = [{
        field: "id", title: "#", sortable: true
    }, {
        field: "name", title: "Name", sortable: true
    }, {
        field: "taxRefNo", title: "Tax Ref. No.", sortable: true
    }, {
        field: "salesRefNo", title: "Sales Tax No.", sortable: true
    }, {
        field: "payrolRefNo", title: "Payrol Ref. No.", sortable: true
    }, {
        field: "noOfEmp", title: "No of Employees", sortable: true
    }];
}])