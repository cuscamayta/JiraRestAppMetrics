app.service('timeSheetService', ['$http', '$q', function ($http, $q) {

    this.getTimeSheetInDates = function (user) {
        var defer = $q.defer();
        $http.post('/getTimeSheetInDates', user).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getTimeSheetInSprint = function (sprint, user) {
        var defer = $q.defer();
        $http.get('/getTimeSheetInSprint?sprint=' + sprint + '&user=' + user).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    }
}])
