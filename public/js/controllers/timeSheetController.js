app.controller('timeSheetController', function ($scope, $location, $rootScope, timeSheetService, commonService, settingService) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });


    function init() {
        var settings = settingService.getSettings();
        if (!settings.user.data) return;
        var response = !settings.isInRangeDates ? timeSheetService.getTimeSheetInDates(settings)
            : timeSheetService.getTimeSheetInSprint(settings.project.sprint.id, settings.user.data.name);

        response.then(function (data) {
            $scope.worksLogs = data;
        });
    }


})
