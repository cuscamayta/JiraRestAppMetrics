app.service('timeSheetService', ['$http', '$q', function($http, $q) {

    this.getTimeSheet = function(user) {
        var defer = $q.defer();
        $http.post('/getWorkLogs', user).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
}])
