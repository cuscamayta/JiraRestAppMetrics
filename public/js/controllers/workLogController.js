app.controller('workLogController', function ($scope, worklogService, commonService) {

  $scope.toggleGroupParent = function (group) {
    if ($scope.isGroupShownParent(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShownParent = function (group) {
    return $scope.shownGroup === group;
  };

  $scope.isIssueShow = function (issue) {
    return $scope.showIssue === issue;
  };
  $scope.toggleGroup = function (issue) {
    if ($scope.isIssueShow(issue)) {
      $scope.showIssue = null;
    } else {
      $scope.showIssue = issue;
    }
  };

  $scope.updateTimeLogged = function (issue, timeLogged) {
    issue.timeLogged = issue.timeLogged + timeLogged;
    issue.timeLogged = issue.timeLogged > 0 ? issue.timeLogged : 0;
    issue.timeLoggedLabel = convertSecondsToTime(issue.timeLogged);
  };
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    init();
  });

  $scope.saveWorklog = function (issue) {
    var worklog = { worklog: issue.timeLoggedLabel, issue: issue.key };
    worklogService.saveWorklog(worklog).then(function (data) {
      commonService.showAlert(data.message, function () { init(); });
    })
  }
  function init() {
    var userSetting = commonService.getUser();
    worklogService.getIssuesByDeveloper(userSetting.data.name).then(function (data) {
      $scope.issuesToLog = [];
      for (key in data) {
        var issue = {
          title: key,
          issues: data[key]
        }
        $scope.issuesToLog.push(issue);
      }      
    });

  }
})
