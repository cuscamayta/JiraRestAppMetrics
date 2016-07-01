var app = angular.module('jiraRestApp', ['ionic', 'pickadate'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

     .state('timesheet', {
            url: '/timesheet',
            controller: 'TabsCtrl',
            templateUrl: 'templates/timesheet/timesheet.html'
        })
        .state('timesheet.home', {
            url: '/home',
            views: {
                'home-timesheet': {
                    templateUrl: 'templates/timesheet/timesheet-home.html',
                    controller: 'timeSheetController'
                }
            }
        })
        .state('timesheet.settings', {
            url: '/settings',
            views: {
                'settings-timesheet': {
                    templateUrl: 'templates/timesheet/timesheet-settings.html'
                }
            }
        })

        .state('worklog', {
            url: '/worklog',
            controller: 'TabsCtrl',
            templateUrl: 'templates/worklog/worklog.html'
        })
        .state('worklog.chart', {
            url: '/chart',
            views: {
                'home-worklog': {
                    templateUrl: 'templates/worklog/worklog-chart.html',
                    controller: 'loginController'
                }
            }
        })
        .state('worklog.settings', {
            url: '/settings',
            views: {
                'settings-worklog': {
                    templateUrl: 'templates/worklog/worklog-settings.html'
                }
            }
        })
        // .state('about', {
        //     url: '/about',
        //     controller: 'loginController',
        //     templateUrl: 'about.html'
        // });

    $urlRouterProvider.otherwise('/timesheet');

});

app.controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {

    $scope.openMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }

});
