app.controller('metricalIssueDetailController', function ($scope, commonService, metricalIssueService, $location) {


    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });


    function init() {
        if (isvalidConfiguration())
            loadDetailForMetricsByIssueType();
        else
            commonService.showAlert('configuration not valid', function () {
                $location.path('metricalIssue/settings')
            });

    }

    function isvalidConfiguration() {
        $scope.settings = commonService.getMetricalIssueSettings();

        if ($scope.settings.totalTimeTeam <= 0 || $scope.settings.project.name == '' || $scope.settings.sprint.id == '')
            return false;
        return true;
    }

    function loadDetailForMetricsByIssueType() {
        $scope.totalTimeTeamString = $scope.settings.totalTimeTeam + " h";
        $scope.totalTimeTeam = $scope.settings.totalTimeTeam;
        var response = metricalIssueService.getMetricsOfTimeForIssue($scope.settings).then(function (issues) {
            var listIssueResume = issues.select(function (issue) {
                issue.iconClass = commonService.getIconForIssueType(issue.issueType);
                issue.timeSpentString = convertSecondsToTime(issue.timeSpent);
                issue.timeStimateString = convertSecondsToTime(issue.timeStimate);
                issue.timeSpentInHours = parseInt(issue.timeSpent / 3600);
                issue.timeSpentPercent = (issue.timeSpentInHours * 100) / $scope.totalTimeTeam;
                return issue;
            });
            listIssueResume.push(createItemTimeNotRegister(listIssueResume));
            $scope.listIssuesResume = listIssueResume;
        });
    }

    function createItemTimeNotRegister(issues) {
        var totalHoursWorked = issues.sum(function (issue) { return issue.timeSpentInHours; }),
            timeSpentInHours = $scope.totalTimeTeam - totalHoursWorked,
            timeSpent = $scope.totalTimeTeam - timeSpentInHours,
            timeSpentPercent = (timeSpentInHours * 100) / $scope.totalTimeTeam;

        return {
            issueType: "Not Register",
            issuesGroup: [],
            iconClass: 'ion-stats-bars',
            countStartSprint: 0,
            countEndSprint: 0,
            timeSpentString: timeSpentInHours + ' h',
            timeStimateString: '0 h',
            timeSpentInHours: timeSpentInHours,
            timeSpentPercent: timeSpentPercent
        }
    }



})