var app = angular.module('jiraRestApp', ['ionic', 'pickadate', 'ionic-modal-select']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('customeInterceptor');
    $stateProvider
        .state('timesheet', {
            url: '/timesheet',
            controller: 'TabsCtrl',
            templateUrl: 'templates/timesheet/timesheet.html'
        })
        .state('timesheet.settings', {
            url: '/settings',
            views: {
                'settings-timesheet': {
                    templateUrl: 'templates/timesheet/timesheet-settings.html',
                    controller: 'settingController'
                }
            }
        })
        .state('timesheet.detail', {
            url: '/detail',
            views: {
                'detail-timesheet': {
                    templateUrl: 'templates/timesheet/timesheet-detail.html',
                    controller: 'timeSheetController'
                }
            }
        })
        .state('timesheet.issues', {
            url: '/detail/:key',
            views: {
                'detail-issues-timesheet': {
                    templateUrl: 'templates/timesheet/timesheet-detail-issues.html',
                    controller: 'timeSheetDetailIssuesController'
                }
            }
        })
        .state('worklog', {
            url: '/worklog',
            controller: 'TabsCtrl',
            templateUrl: 'templates/worklog/worklog.html'

        })
        .state('worklog.issues', {
            url: '/issues',
            views: {
                'worklog-issues': {
                    templateUrl: 'templates/worklog/worklog-issues.html',
                    controller: 'workLogController'
                }
            }
        })
        .state('metrical', {
            url: '/metrical',
            controller: 'TabsCtrl',
            templateUrl: 'templates/metrical/metrical.html'
        })
        .state('metrical.chart', {
            url: '/chart',
            views: {
                'chart-metrical': {
                    templateUrl: 'templates/metrical/metrical-chart.html',
                    controller: 'bugPrioridadController'
                }
            }
        })
        .state('metrical.settings', {
            url: '/settings',
            views: {
                'settings-metrical': {
                    templateUrl: 'templates/metrical/metrical-settings.html',
                    controller: 'bugPrioridadController'
                }
            }
        })
        .state('metrical.detail', {
            url: '/detail',
            views: {
                'detail-metrical': {
                    templateUrl: 'templates/metrical/metrical-detail.html',
                    controller: 'bugPrioridadDetailController'
                }
            }
        })
        .state('metricalTeam', {
            url: '/metricalTeam',
            controller: 'TabsCtrl',
            templateUrl: 'templates/metrical/metricalTeam/metrical-Team.html'
        })
        .state('metricalTeam.detail', {
            url: '/detail',
            views: {
                'detail-metrical-team': {
                    templateUrl: 'templates/metrical/metricalTeam/metrical-team-detail.html',
                    controller: 'metricalTeamDetailController'
                }
            }
        })
        .state('metricalTeam.chart', {
            url: '/chart',
            views: {
                'chart-metrical-team': {
                    templateUrl: 'templates/metrical/metricalTeam/metrical-team-chart.html',
                    controller: 'metricalTeamChartController'

                }
            }
        })
        .state('metricalTeam.settings', {
            url: '/settings',
            views: {
                'settings-metrical-team': {
                    templateUrl: 'templates/metrical/metricalTeam/metrical-team-settings.html',
                    controller: 'metricalTeamSettingController'
                }
            }
        })///
        .state('metricalIssue', {
            url: '/metricalIssue',
            controller: 'TabsCtrl',
            templateUrl: 'templates/metrical/metricalIssue/metrical-issue.html'
        })
        .state('metricalIssue.detail', {
            url: '/detail',
            views: {
                'detail-metrical-issue': {
                    templateUrl: 'templates/metrical/metricalIssue/metrical-issue-detail.html',
                    controller: 'metricalIssueDetailController'
                }
            }
        })
        .state('metricalIssue.chart', {
            url: '/chart',
            views: {
                'chart-metrical-issue': {
                    templateUrl: 'templates/metrical/metricalIssue/metrical-issue-chart.html',
                    controller: 'metricalIssueChartController'

                }
            }
        })
        .state('metricalIssue.settings', {
            url: '/settings',
            views: {
                'settings-metrical-issue': {
                    templateUrl: 'templates/metrical/metricalIssue/metrical-issue-settings.html',
                    controller: 'metricalIssueSettingController'
                }
            }
        })
        .state('login', {
            url: '/login',
            controller: 'loginController',
            templateUrl: 'templates/login.html'
        })

    $urlRouterProvider.otherwise('/timesheet');
});

app.controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {

    $scope.openMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }

});

app.controller('HomeTabCtrl', function($scope, $ionicSideMenuDelegate) {

});



app.controller('AboutCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.openMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }
});



app.factory('customeInterceptor', ['$timeout', '$injector', '$q', '$location', function($timeout, $injector, $q, $location) {

    var requestInitiated;
    var hasTolog;
    function showLoadingText() {
        $injector.get("$ionicLoading").show({
            template: 'Loading...',
            animation: 'fade-in',
            showBackdrop: true
        });
    };

    function hideLoadingText() {
        $injector.get("$ionicLoading").hide();
    };

    return {
        request: function(config) {

            hasTolog = true;
            var extension = config.url.slice(-4);
            if (extension != "html") {

                requestInitiated = true;
                showLoadingText();
            }


            return config;
        },
        response: function(response) {

            requestInitiated = false;

            // Show delay of 300ms so the popup will not appear for multiple http request
            $timeout(function() {

                if (requestInitiated) return;
                hideLoadingText();

            }, 300);

            return response;
        },
        requestError: function(err) {

            hideLoadingText();

            return err;
        },
        responseError: function(err) {
            hideLoadingText();
            if (err.status == 401) {
                var commonService = $injector.get('commonService');

                hasTolog = false;
                commonService.showAlert('You must login to continue.', function() {
                    $location.path('/login');
                });


            }
            return $q.reject(err);
        }
    }
}]);

// app.config(function ($urlRouterProvider, $httpProvider) {
//     //  $httpProvider.interceptors.push('customeInterceptor');
//     $urlRouterProvider.otherwise('/');
// });