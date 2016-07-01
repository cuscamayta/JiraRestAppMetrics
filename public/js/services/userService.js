app.service('userService', ['$http', '$q', function($http, $q) {

    this.signIn = function(user) {
        var defer = $q.defer();
        $http.post('/login', user).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
}])

