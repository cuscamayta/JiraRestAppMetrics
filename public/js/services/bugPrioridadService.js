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
        $http.get('/getMetricsByTypeIssue?project='.concat(data.project.key,'&sprint=',data.project.sprint.id,'&fixVersions=',data.project.version.name)).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

 this.getMetricsByTypeIssueWitOutVersionByPriority = function(data) {
        
        var defer = $q.defer();
        $http.get('/getMetricsByTypeIssueWithOutVersion?project='.concat(data.project.key,'&sprint=',data.project.sprint.id)).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.getMetricsByBugPriorityDate = function(data) {
        
        var defer = $q.defer();
        $http.get('/getMetricsByBugInPeriod?project='.concat(data.project.key,'&fixVersions=',data.project.version.name,'&startDate=',data.startDate,'&endDate=',data.endDate)).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }
    this.getMetricsByBugPriorityDateWithOutVersion = function(data) {
        
        var defer = $q.defer();
        $http.get('/getMetricsByBugInPeriodWithOutVersion?project='.concat(data.project.key,'&fixVersions=',data.project.version.name,'&startDate=',data.startDate,'&endDate=',data.endDate)).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }
}])