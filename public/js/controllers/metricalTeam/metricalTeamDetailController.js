app.controller('metricalTeamDetailController', function ($scope, commonService, metricalTeamService, settingService, $rootScope) {
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });

    function init() {
        $scope.settings = settingService.settings;
        loadChartOfReport();
    }
    function loadChartOfReport() {
        if (!$rootScope.reportTeam)
            metricalTeamService.getTimebyDeveloper($scope.settings.project.sprint.id).then(function (result) {
                $rootScope.reportTeam = result;

            });
    }
})
