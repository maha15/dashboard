nuageApp.controller('companyCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.onTabClick = function (tab) { $scope.var.activeTab = tab; };
    $scope.var = {
        activeTab: "create"
    };
    if ($state.current.name == "company")
        $state.go('company.create');
}])
