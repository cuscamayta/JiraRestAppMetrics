app.service('metricalTeamService', ['$http', '$q', function($http, $q) {

    this.getTimebyDeveloper = function(sprintID) {
        var defer = $q.defer();
        $http.get('/getTimebyDeveloper?idSprint=' + sprintID ).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
}])
