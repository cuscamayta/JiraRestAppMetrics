app.controller('workLogController', function($scope, worklogService, commonService,settingService) {

    $scope.toggleGroupParent = function(group) {
        if ($scope.isGroupShownParent(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShownParent = function(group) {
        return $scope.shownGroup === group;
    };

    $scope.isIssueShow = function(issue) {
        return $scope.showIssue === issue;
    };
    $scope.toggleGroup = function(issue) {
        if ($scope.isIssueShow(issue)) {
            $scope.showIssue = null;
        } else {

            $scope.showIssue = issue;
        }
    };

    $scope.updateTimeLogged = function(issue, timeLogged) {
        issue.timeLogged = issue.timeLogged + timeLogged;
        issue.timeLogged = issue.timeLogged > 0 ? issue.timeLogged : 0;
        issue.timeLoggedLabel = convertSecondsToTime(issue.timeLogged);
    };
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        init();
    });

    $scope.saveWorklog = function(issue) {
        var worklog = { worklog: issue.timeLoggedLabel, issue: issue.key };
        worklogService.saveWorklog(worklog).then(function(data) {
            debugger;
               if (data.success)
                { toastr.success("Se guardo correctamente");
                     init();
                }  else
                  toastr.error("Error al guardar intente nuevamente");
               
          
        })
    }
    function init() {
         $scope.settings = settingService.getSettings();
        
        worklogService.getIssuesByDeveloper( $scope.settings.user.data.name).then(function(data) {
            $scope.issuesToLog = data;
        
        });

    }
})
