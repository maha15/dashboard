nuageApp.controller('userCtrl', ['$scope', '$state', function ($scope, $state) {

    $scope.onTabClick = function (tab) { $scope.var.activeTab = tab; };
    $scope.var = {
        activeTab: "requests"
    };

    if ($state.current.name == "user")
        $state.go('user.requests');
}])