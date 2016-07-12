app.service('userService', ['$http', '$q', function($http, $q) {

    this.signIn = function(user) {
        var defer = $q.defer();
        $http.post('/login', user).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
    
    this.logout = function() {
        var defer = $q.defer();
        $http.post('/logout').success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
    
    this.testSession = function() {
        var defer = $q.defer();
        $http.post('/testSession').success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
        
        
}])

