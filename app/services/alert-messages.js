nuageApp.service('AlertMessage', function ($rootScope) {
    this.error = function (msg) {
        $rootScope.$broadcast('onAlterMessage', {
            msg: msg,
            type: "Error",
            msgclass: "danger",
            addTimer: "true",
            interval: 8000
        });
    },
    this.success = function (msg) {
        $rootScope.$broadcast('onAlterMessage', {
            msg: msg,
            type: "Success",
            msgclass: "success",
            addTimer: "true",
            interval: 4000
        });
    },
   this.warning = function (msg) {
       $rootScope.$broadcast('onAlterMessage', {
           msg: msg,
           type: "Warning",
           msgclass: "warning",
           addTimer: "true",
           interval: 6000
       });
   };
    this.info = function (msg) {
        $rootScope.$broadcast('onAlterMessage', {
            msg: msg,
            type: "Info",
            msgclass: "info",
            addTimer: "true",
            interval: 4000
        });
    };
    this.permanent = function (msg) {
        $rootScope.$broadcast('onAlterMessage', {
            msg: msg,
            type: "Info",
            msgclass: "info",
            addTimer: "true",
            interval: 60000
        });
    };
    this.progress = function (msg, value, wait, type, msgclass) {
        $rootScope.$broadcast('onProgress', {
            msg: msg,
            value: value,
            wait: wait,
            type: type,
            msgclass: msgclass,
        });
    };
});