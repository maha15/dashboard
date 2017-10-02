
nuageApp.filter("rounded", function () {
    return function (val) {
        var frac = (val.toString()).indexOf('.');
        if (frac != -1)
            return Math.round(val) + 1;
        else
            return val;
    }
});