app.controller('SettingsController', function($scope, commonService, $ionicModal, settingService, $rootScope) {


    $scope.settings = settingService.getSettings();

    $scope.$watch('settings', function(newValue, oldValue) {
        if (newValue.project && newValue.project.key != oldValue.project.key) {
            $scope.loadVersions(newValue.project);
            $scope.loadSprints(newValue.project);
        }
        $rootScope.summaryIssuesByType = undefined;
        $rootScope.dataPriority = undefined;
        $rootScope.reportTeam = undefined;
        setInLocalStorage('jiraMobileSettings', $scope.settings);
    }, true);

    $scope.loadVersions = function(project) {
        if (projectHasVersions(project.key)) return;

        commonService.getVersionsByProject(project.key).then(function(versions) {
            var project = getProjectByKey($scope.settings.project.key);
            project.versions = versions.items;
            $scope.projectVersions = project.versions;
            // $scope.settings.project.version = versions.items[versions.items.length - 1];
        })
    }

    $scope.loadSprints = function(project) {
        if (projectHasSprints(project.key)) return;

        commonService.getSprintsByProject(project.key).then(function(sprints) {
            var project = getProjectByKey($scope.settings.project.key);
            project.sprints = sprints.items;
            $scope.projectSprints = project.sprints;
            //   $scope.settings.project.sprint = sprints.items[sprints.items.length - 1];
        })
    }

    function projectHasVersions(projectkey) {
        var project = getProjectByKey(projectkey);
        if (project && project.versions) {
            $scope.projectVersions = project.versions;
            //  $scope.settings.project.version = project.versions[project.versions.length - 1];
            return true;
        }
        else {
            $scope.projectVersions = [];
            return false;
        }
    }

    function projectHasSprints(projectkey) {
        var project = getProjectByKey(projectkey);
        if (project && project.sprints) {
            $scope.projectSprints = project.sprints;
            //   $scope.settings.project.sprint = project.sprints[project.sprints.length - 1];
            return true;
        }
        else {
            $scope.projectSprints = [];
            return false;
        }
    }

    function getProjectByKey(projectKey) {
        var project = $scope.settings.jira.projects.where(function(project) {
            return project.key == projectKey;
        }).first();
        return project;
    }

})

