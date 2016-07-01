app.controller('settingController', function($scope, commonService) {
	
    $scope.currentUser = commonService.getUser();
    $scope.$watch('settings', function(newValue, oldValue) {
        $scope.settings.userName = newValue.useCurrentUser ? $scope.currentUser.data.name : newValue.userName;
        $scope.settings.projectName = newValue.useDefaultProject ? 'RMTOOLS' : newValue.projectName;

        setInLocalStorage('settings', $scope.settings);
    }, true);

    $scope.settings = commonService.getSettings();

})
