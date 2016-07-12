app.service('settingService', ['$http', '$q', function($http, $q) {

    this.defaulSettings = function() {
        return {
            useCurrentUser: true,
            user: {},
            isInRangeDates: true,
            startDate: '',
            endDate: '',
            project: {
                name: '',
                key: '',
                sprint: {
                    id: '',
                    name: '',
                },
                version: {
                    id: '',
                    name: ''
                }
            },
            jira: {
                projects: []
            }
        }
    }


    this.saveUserInLocalStorage = function(user) {
        var settings = this.getSettings();
        settings.user = user;
        setInLocalStorage('jiraMobileSettings', settings);
    };

    this.saveProjectInLocalStorage = function(project) {
        var settings = this.getSettings();
        settings.project = project;
        setInLocalStorage('jiraMobileSettings', settings);
    };

    this.saveProjectsInLocalStorage = function(projects) {
        var settings = this.getSettings();
        settings.jira.projects = projects;
        setInLocalStorage('jiraMobileSettings', settings);
    }

    this.getProject = function() {
        var settings = getItemFromLocalstorage('jiraMobileSettings');
        if (settings)
            return settings.project;
        return this.defaulSettings().project;
    }

    this.getProjects = function() {
        var settings = getItemFromLocalstorage('jiraMobileSettings');
        if (settings)
            return settings.jira.projects;
        else return [];
    }

    this.getSettings = function() {
        var settings = getItemFromLocalstorage('jiraMobileSettings');
        if (settings)
            return settings;
        else
            return this.defaulSettings();
    }

    this.loadSettingForUser = function() {
        var defer = $q.defer();
        $http.get('/getProjects').success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.settings = this.getSettings();

}])

