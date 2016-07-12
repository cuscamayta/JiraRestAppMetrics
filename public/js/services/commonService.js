app.service('commonService', ['$http', '$q', '$ionicPopup', function ($http, $q, $ionicPopup) {

    this.showAlert = function (message, onFinish) {
        var alertPopup = $ionicPopup.alert({
            title: 'Jira Says.',
            template: message,
            buttons: [{
                text: 'Close',
                type: 'button-assertive'
            }]
        });

        alertPopup.then(function (res) {
            if (onFinish)
                onFinish();
        });
    };
    this.showSucces = function (message, onFinish) {
        var alertPopup = $ionicPopup.alert({
            title: 'Jira Says.',
            template: message,
            buttons: [{
                text: 'Close',
                type: 'button-balanced'
            }]
        });

        alertPopup.then(function (res) {
            if (onFinish)
                onFinish();
        });
    };
    // this.getSettings = function () {
    //     var settings = getItemFromLocalstorage('settings'),
    //         user = this.getUser();


    //     if (!user && !settings) return null;

    //     if (settings)
    //         return settings;
    //     else
    //         return {
    //             useCurrentUser: true,
    //             userName: user.data.name,
    //             useDefaultProject: true,
    //             projectName: 'RMTOOLS',
    //             useDefaultDate: true,
    //             startDate: formatDateJira(new Date()),
    //             endDate: addDaysToday(10),
    //             bySprint: true
    //         };
    // };

    // this.getSettingsMetrical = function () {
    //     var settings = getItemFromLocalstorage('metricalSettings');

    //     if (settings)
    //         return settings;
    //     else
    //         return {
    //             projectKey: -1,
    //             project: "",
    //             sprintNumber: -1,
    //             sprint: "",
    //             issueTypes: "",
    //             version: "",
    //             startDate: formatDateJira(new Date()),
    //             endDate: addDaysToday(10),
    //             titleDetail: ""
    //         };
    // };

    this.getUser = function () {
        return getItemFromLocalstorage('currentUser');
    }

    this.isUserLogged = function () {
        var user = this.getUser();
        return user ? true : false;
    }

    this.isSettingValid = function () {
        var settings = this.getSettings();
        if (!settings) return false;

        if (settings.userName && settings.projectName)
            return true;
        return false;

    }

    this.getProjects = function () {
        var defer = $q.defer();
        $http.get('/getProjects').success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    //remove after implement settings
    this.getSprintNumbersByProject = function (projectKey) {
        var defer = $q.defer();
        $http.get('/getSprintsByProject?project=' + projectKey).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getSprintsByProject = function (projectKey) {
        var defer = $q.defer();
        $http.get('/getSprintsByProject?project=' + projectKey).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getVersionsByProject = function (project) {
        var defer = $q.defer();
        $http.get('/getprojectVersions?project='.concat(project)).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    }


    // this.getMetricalTeamSettings = function () {
    //     var settings = getItemFromLocalstorage('metricalTeamsettings');

    //     if (settings != null)
    //         return settings;
    //     else
    //         return {
    //             projectSelected:
    //             { name: "", key: "", issuetypes: [] },
    //             sprintSelected:
    //             { id: "", name: "" }
    //         };
    // };

    // this.getMetricalIssueSettings = function () {
    //     var settings = getItemFromLocalstorage('metricalIssueSettings');

    //     if (settings != null)
    //         return settings;
    //     else
    //         return {
    //             project: {},
    //             sprint: {},
    //             totalTimeTeam: 0
    //         };
    // };

    this.getIconForIssueType = function (issueType) {
        var iconClass = '';
        switch (issueType) {
            case 'Bug':
                iconClass = 'ion-bug';
                break;
            case 'Story':
                iconClass = 'ion-android-bookmark';
                break;
            case 'New Feature':
                iconClass = 'ion-plus-circled';
                break;
            case 'Task':
                iconClass = 'ion-android-checkbox';
                break;
            case 'Improvement':
                iconClass = 'ion-arrow-up-a';
                break;
            case 'Epic':
                iconClass = 'ion-flash';
                break;
            case 'Overhead':
                iconClass = 'ion-android-radio-button-on';
                break;
            case 'QA Manual':
                iconClass = 'ion-android-radio-button-on';
                break;
            default:
                iconClass = "ion-android-checkbox-outline-blank";
                break;
        }

        return iconClass;
    }

    this.getIconForPriority = function (priority) {
        var iconClass = '';
        switch (priority) {
            case 'Major':
                iconClass = 'ion-ios-upload-outline';
                break;
            case 'Blocker':
                iconClass = 'ion-lock-combination';
                break;
            case 'Critical':
                iconClass = 'ion-ios-upload';
                break;
            case 'Minor':
                iconClass = 'ion-ios-download-outline';
                break;
            case 'Trivial':
                iconClass = 'ion-ios-download';
                break;
            default:
                iconClass = "ion-android-checkbox-outline-blank";
                break;
        }

        return iconClass;
    }
}])
