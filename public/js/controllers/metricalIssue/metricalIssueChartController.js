app.controller('metricalIssueChartController', function ($scope, commonService, metricalIssueService) {
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });

    function init() {
        $scope.chartTitle = 'Metrics time registered for issueType'
        loadChartForMetricsByIssueType();
    }

    function loadChartForMetricsByIssueType() {
        var settings = commonService.getMetricalIssueSettings();
        var response = metricalIssueService.getMetricsOfTimeForIssue(settings).then(function (issues) {
            var listIssueResume = issues.select(function (issue) {
                issue.timeSpentInHours = parseInt(issue.timeSpent / 3600);
                issue.timeSpentPercent = (issue.timeSpentInHours * 100) / settings.totalTimeTeam;
                return issue;
            });
            var totalPercent = 100 - listIssueResume.sum(function (issueResume) {
                return issueResume.timeSpentPercent;
            });

            var listIssuesForChart = listIssueResume.select(function (issueResume) {
                return [issueResume.issueType, issueResume.timeSpentPercent];
            })
            listIssuesForChart.push(['Not Register', totalPercent]);

            $scope.listIssuesResume = listIssuesForChart;
        });
    }
})