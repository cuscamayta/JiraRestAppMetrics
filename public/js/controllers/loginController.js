app.controller('loginController', function ($scope, userService, $location, commonService, settingService) {
    $scope.signIn = function (user) {
        var response = userService.signIn(user);
        response.then(function (data) {
            if (data.hasBeenLogged) {
                settingService.saveUserInLocalStorage(data);
                loadSettingsForUser();
            } else
                commonService.showAlert('user or password incorrect', initLogin());
        });
    };

    function initLogin() {
        $scope.user = {};
    }

    function loadSettingsForUser() {
        settingService.loadSettingForUser().then(function (projects) {
            settingService.saveProjectsInLocalStorage(projects.items);
            $location.path('/settings/config');
        });
    }
})
