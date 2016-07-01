app.service('bugPrioridadService', ['$http', '$q', function($http, $q) {

    this.getBugPriridad = function(datoPrioridad) {
        var defer = $q.defer();
        $http.post('/getBugPrioridad',datoPrioridad).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getProyectos = function(data) {
        var defer = $q.defer();
        $http.get('/getProjects').success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.getVersions = function(data) {
        var defer = $q.defer();
        $http.get('/getprojectVersions?project='.concat(data)).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.getMetricsByTypeIssueByPriority = function(data) {
        
        var defer = $q.defer();
        $http.get('/getMetricsByTypeIssue?project='.concat(data.projectKey,'&issueType=',data.issueTypes,'&sprint=',data.sprintNumber,'&fixVersions=',data.version)).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }
}])