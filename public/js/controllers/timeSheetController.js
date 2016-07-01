app.controller('timeSheetController', function ($scope, $location, $rootScope, timeSheetService, commonService) {

    function initialize() {
        $scope.user = commonService.getUser();
        $scope.settings = commonService.getSettings();
        $scope.worksLogs = [];
        $scope.datesSprint = getDatesWorkLogged();
    }

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        init();
    });



    function getDatesWorkLogged() {
        var fromDate = moment(new Date($scope.settings.startDate)),
            toDate = moment(new Date($scope.settings.endDate));
        var datesSprint = enumerateDaysBetweenDates(fromDate, toDate);
        return datesSprint;
    }

  function init() {
        if (!commonService.isUserLogged()) {
            commonService.showAlert('Please login again...', function () {
                $location.path('/login');
            });
            return;
        }
        if (commonService.isUserLogged() && commonService.isSettingValid()) {
            initialize();
            var response = timeSheetService.getTimeSheet($scope.settings);
            response.then(function (data) {
                if (data.issues.length <= 0) commonService.showAlert('No tiene datos para mostrar, Configure con otros datos.', function () {
                    $location.path('/tab/setting');
                });

                loadTimeSheet(data.issues, $scope.datesSprint);
            });
        } else {
            commonService.showAlert('los datos de configuracion no son validos revise porfavor');
            $location.path('/tab/setting');
        }
    }
    function getWorkLogs(worklogs, issue) {
        var worklogsResult = worklogs.select(function (worklog) {
            return {
                timeSpent: worklog.timeSpent,
                timeSpentSeconds: worklog.timeSpentSeconds,
                updated: moment(worklog.started).format('D/M/YYYY'),
                userUpdated: worklog.updateAuthor.name,
                author: {
                    name: worklog.author.name,
                    displayName: worklog.author.displayName,
                    avatarUrl: worklog.author.avatarUrls["48x48"]
                },
                issue: issue
            };
        });
        return worklogsResult;
    }

    function getTimeSpentInSecondForIssue(issue) {
        var worklogs = issue.fields.worklog.worklogs.where(function (worklog) {
            return worklog.author.name.toUpperCase() == $scope.settings.userName.toUpperCase();
        });
        if (worklogs && worklogs.length > 0)
            return worklogs.sum(function (item) {
                return item.timeSpentSeconds;
            });
        else
            return 0;
    }


    function getIssuesWithWorkLog(issues) {
        var worklogsResult = issues.select(function (issue) {
            return {
                worklogs: getWorkLogs(issue.fields.worklog.worklogs, {
                    key: issue.key,
                    id: issue.id,
                    timeLogged: 0,
                    timeSpent: 0,
                    timeLoggedLabel: '0h 0m'
                })
            };
        });        
        return worklogsResult;
    }

    function loadTimeSheet(issues, datesSprint) {
        var issuesResult = getIssuesWithWorkLog(issues);
        var countDay = 0;
        angular.forEach(datesSprint, function (date) {
           
            countDay++;
            searchAndCountWorkLoggedInDate(issuesResult, date, 'Dia : '.concat(countDay));
        });
    }

    function getDateWorkLogDefault(date, numberDay, userAvatar) {
        return {
            totalWorkLogged: convertSecondsToTime(0),
            key: '0',
            date: date,
            dayNumber: numberDay,
            userAvatar: userAvatar,
            issues: [],
            timeSpentSeconds: 0,
            dateUrl: ''
        };
    }

    function dateIsMajorToCurrentDate(dateString) {
        var SpecialToDate = '13/6/2016';

        var SpecialTo = moment(dateString, "D/M/YYYY");
        if (SpecialTo > moment()) {
            return true;
        } else {
            return false;
        }
    }

    function searchAndCountWorkLoggedInDate(issues, date, numberDay) {
        var dateWorkLogs = [];

        angular.forEach(issues, function (issue) {
            var worklogsInDate = issue.worklogs.where(function (worklog) {
                return worklog.userUpdated.toUpperCase() == $scope.settings.userName.toUpperCase() && worklog.updated == date;
            });
            dateWorkLogs = dateWorkLogs.concat(worklogsInDate);
        });

        var dateWork = dateWorkLogs.length > 0 ? {
            totalWorkLogged: convertSecondsToTime(dateWorkLogs.sum(function (datework) {
                return datework.timeSpentSeconds;
            })),
            key: dateWorkLogs.length,
            date: date,
            dayNumber: numberDay,
            userAvatar: dateWorkLogs.first().author.avatarUrl,
            timeSpentSeconds: dateWorkLogs.sum(function (datework) {
                return datework.timeSpentSeconds;
            }),
            issues: dateWorkLogs.select(function (dateWorklog) {
                dateWorklog.issue.timeSpent = convertSecondsToTime(dateWorklog.timeSpentSeconds);
                return dateWorklog.issue;
            }),

            dateUrl: moment(date).format('DDMMYYYY')
        } : getDateWorkLogDefault(date, numberDay, $scope.worksLogs.length > 0 ? $scope.worksLogs.first().userAvatar : '');

        if (!dateIsMajorToCurrentDate(date)) {
            $scope.worksLogs.push(dateWork);

            $rootScope.workLogsList = $scope.worksLogs;
        }

    }
})
