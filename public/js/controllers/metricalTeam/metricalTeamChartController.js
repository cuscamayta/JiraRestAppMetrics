app.controller('metricalTeamChartController', function ($scope, $rootScope, commonService, metricalTeamService, settingService) {



    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        $scope.settings = settingService.getSettings();

        init();
    });

   
    function init() {

        $scope.settings = settingService.getSettings();

        loadChartOfReport();
    }

    function loadChartOfReport() {
        if (!$rootScope.reportTeam)
            metricalTeamService.getTimebyDeveloper($scope.settings.project.sprint.id).then(function (result) {

                clearSeries($rootScope.limitedPrioridades);
                $scope.titlechart =  $scope.settings.project.sprint.name +" - " +  $scope.settings.project.name;
                $rootScope.reportTeam = result;
                if (result)
                    var data =
                        $rootScope.limitedPrioridades.addSeriesPie(result.select(function (item) {
                            return [item.userName, item.timeValue];
                        }), $scope.titlechart);
            });
    }

    function clearSeries(chart) {
        var length = chart.series ? chart.series.length : 0;
        for (var i = 0; i < length; i++) {
            chart.series[0].remove(true);
        }
    }


})
