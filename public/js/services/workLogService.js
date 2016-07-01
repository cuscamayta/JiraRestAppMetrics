app.service('worklogService', function ($http, $q) {

    this.getIssuesByDeveloper = function (developer) {
        var defer = $q.defer();
        $http.get('/getIssuesByDeveloper?developer='.concat(developer)).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };



    this.saveWorklog = function (worklog) {
        var defer = $q.defer();
        $http.post('/saveLogWork', worklog).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

})


