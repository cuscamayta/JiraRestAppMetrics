app.controller('metricalTeamSettingController', function ($scope, commonService, $ionicModal) {


    init();
    function init() {
        $scope.metricalTeamsettings = commonService.getMetricalTeamSettings();
        loadProjects();
    }


    function loadProjects() {

        var projects = commonService.getProjects();
        projects.then(function (data) {

            $scope.projects = data.items
        });
    }


    $scope.loadSprint = function (item) {
        $scope.metricalTeamsettings.sprintSelected = { id: "", name: "" };
        $scope.metricalTeamsettings.projectSelected = item;
        var response = commonService.getSprintNumbersByProject(item.key);
        response.then(function (data) {
            $scope.sprintsByProjects = data.items
        });
    }

    $scope.setSprintSelected = function (item) {
        $scope.metricalTeamsettings.sprintSelected = item;
    }

    $scope.$watch('metricalTeamsettings', function (newValue, oldValue) {
        $scope.metricalTeamsettings.projectSelected = newValue.projectSelected;
        $scope.metricalTeamsettings.sprintSelected = newValue.sprintSelected;

        setInLocalStorage('metricalTeamsettings', $scope.metricalTeamsettings);
    }, true);



})
