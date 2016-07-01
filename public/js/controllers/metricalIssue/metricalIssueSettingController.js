app.controller('metricalIssueSettingController', function ($scope, commonService) {

    init();

    function init() {
        $scope.metricalIssueSettings = commonService.getMetricalIssueSettings();
        loadProjects();
    }

    function loadProjects() {
        var projects = commonService.getProjects();
        projects.then(function (data) {
            $scope.projects = data.items
        });
    }

    $scope.loadSprint = function (item) {
        $scope.metricalIssueSettings.project = item;
        $scope.metricalIssueSettings.sprint = {};
        var response = commonService.getSprintNumbersByProject($scope.metricalIssueSettings.project.key);
        response.then(function (data) {
            $scope.sprintsByProjects = data.items
        });
    }

    $scope.setSprintSelected = function (item) {
        $scope.metricalIssueSettings.sprint = item;
    }

    $scope.$watch('metricalIssueSettings', function (newValue, oldValue) {
        $scope.metricalIssueSettings.project = newValue.project;
        $scope.metricalIssueSettings.sprint = newValue.sprint;

        setInLocalStorage('metricalIssueSettings', $scope.metricalIssueSettings);
    }, true);


})