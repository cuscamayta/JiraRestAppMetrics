app.controller('bugPrioridadDetailController', function ($scope, $location, commonService, bugPrioridadService) {
    $scope.iconClassMetricalDetail = {};
    $scope.dataPriority = {};
    $scope.metricalDetailSettings = {
        project: "",
        sprint: "",
        issueTypes: "",
        version: "",
        startDate: formatDateJira(new Date()),
        endDate: addDaysToday(10),
        bySprint: true,
        titleDetail: ""
    };

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
        initialize();
    });

    function arrayFromObject(obj) {
        var arr = [];
        for (var i in obj) {
            arr.push(obj[i]);
        }
        return arr;
    }

    function groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    }

    function initialize() {
        $scope.metricalDetailSettings = commonService.getSettingsMetricalDetail();
        $scope.iconClassMetricalDetail = commonService.getIconForIssueType($scope.metricalDetailSettings.issueTypes);
        getDataDetail();
    }

    function getDataDetail() {

        var response = bugPrioridadService.getMetricsByTypeIssueByPriority(commonService.getSettingsMetrical());
        response.then(function (data) {

            var dataNotFilter = data.items.select(function (item) {
                return item.priority.name;
            });

            var auxgroup = groupBy(dataNotFilter, function (priority) {
                return [priority];
            });
            
            $scope.dataPriority = auxgroup.select(function (params) {
                return [params[0], params.length];
            }).select(function (item) {
                var icon = commonService.getIconForPriority(item[0]);
                return { priority: item[0], count: item[1], iconClass:icon}
            });
        });
    }
})
