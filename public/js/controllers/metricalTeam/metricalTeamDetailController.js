app.controller('metricalTeamDetailController', function($scope, commonService,metricalTeamService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        init();
    });

    function init() {
    $scope.metricalTeamSettings = commonService.getMetricalTeamSettings();
           loadChartOfReport();
    }
	function loadChartOfReport(){
	      metricalTeamService.getTimebyDeveloper($scope.metricalTeamSettings.sprintSelected.id).then(function(result){
	        $scope.reportTeam = result;
	      });
	}

   


})
