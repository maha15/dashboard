nuageApp.controller('createCompanyCtrl', ['$scope', function ($scope) {
    $scope.var.activeTab = "create";
    $scope.company = {
        Name: '',
        Address: '',
        TaxRefNo: '',
        SalesTaxNo: '',
        PayrolRefNo: '',
        NoOfEmp: 0,
    }
    $scope.createCompany = function () {

    };
}])