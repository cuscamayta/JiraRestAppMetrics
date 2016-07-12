app.controller('metricalIssueDetailController', function($scope, commonService, metricalIssueService, $location, settingService, $rootScope) {


    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        init();
    });


    function init() {
        if (isvalidConfiguration())
            loadDetailForMetricsByIssueType();
        else
            commonService.showAlert('configuration not valid', function() {
                $location.path('settings/config');
            });

    }

    function isvalidConfiguration() {
        $scope.settings = settingService.getSettings();
        if ($scope.settings.project.name == '' || $scope.settings.project.sprint.id == '')
            return false;
        return true;
    }

    function loadDetailForMetricsByIssueType() {
        if(!$rootScope.summaryIssuesByType){
            var response = metricalIssueService.getMetricsOfTimeForIssue($scope.settings).then(function(data) {
            var listIssueResume = data.issueTypeSummary.select(function(issue) {
                issue.iconClass = commonService.getIconForIssueType(issue.issueType);
                return issue;
            });
            $rootScope.summaryIssuesByType = {
                listIssuesResume:listIssueResume,
                timeNotRegisterSummary:data.timeNotRegisterSummary,
                totalTimeTeam:data.totaTimeInTeam
            }
           
        });
        }
        
    }

})