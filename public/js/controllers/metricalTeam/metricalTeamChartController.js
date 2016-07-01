app.controller('metricalTeamChartController', function ($scope, commonService, metricalTeamService) {


    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });

    function init() {        
        $scope.metricalTeamSettings = commonService.getMetricalTeamSettings();
        loadChartOfReport();
    }
    function loadChartOfReport() {
        $scope.texto = "Graphic time logged by sprint ";
        metricalTeamService.getTimebyDeveloper($scope.metricalTeamSettings.sprintSelected.id).then(function (result) {
            var logDetail = result.workLogsByDev

            $scope.limitedPrioridades = logDetail.select(function (item) {
                return [item.userName, item.timeValue];
            });
        });
    }


})
