nuageApp.service('Session', function ($window) {
    this.create = function (user) {
        this.id = user.Email;
        this.userId = user.UserId;
        this.userRole = "admin";// user.UserRole;
        this.name = user.FirstName;
    };
    this.save = function (user) {
        $window.sessionStorage.setItem("loginInfo", JSON.stringify(user));
    };
    this.destroy = function () {
        $window.sessionStorage.removeItem("loginInfo");
        this.id = null;
        this.userId = null;
        this.userRole = null;
        this.name = null;
    };
    this.get = function () {
        return $window.sessionStorage.getItem("loginInfo");
    };
})
