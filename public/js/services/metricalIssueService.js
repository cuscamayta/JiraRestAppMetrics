app.service('metricalIssueService', ['$http', '$q', function ($http, $q) {

    this.getMetricsOfTimeForIssue = function (settings) {
        var defer = $q.defer();
        $http.get('/getMetricsOfTimeForIssue?sprint='.concat(settings.project.sprint.id, '&project=', settings.project.key)).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
}])
