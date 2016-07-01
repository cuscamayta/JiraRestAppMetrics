app.controller('loginController', function($scope, userService, $location, commonService) {
    $scope.signIn = function(user) {
        var response = userService.signIn(user);
        response.then(function(data) {            
            if (data.hasBeenLogged) {
                setInLocalStorage('currentUser', data);
                $location.path('timesheet/settings');
            } else
                commonService.showAlert('user or password incorrect', initLogin());
        });
    };

    function initLogin() {
        $scope.user = {};
    }
})
