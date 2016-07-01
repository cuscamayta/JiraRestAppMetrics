app.service('metricalIssueService', ['$http', '$q', function ($http, $q) {

    this.getMetricsOfTimeForIssue = function (parameters) {
        var defer = $q.defer();
        $http.get('/getMetricsOfTimeForIssue?sprint='.concat(parameters.sprint.id, '&project=', parameters.project.key)).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
}])
