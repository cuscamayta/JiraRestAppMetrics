app.controller('bugPrioridadController', function ($scope, $location, bugPrioridadService, commonService) {
  $scope.metricalSettings = {
    projectKey: -1,
    sprintNumber: -1,
    issueTypes: "",
    version: "",
    startDate: formatDateJira(new Date()),
    endDate: addDaysToday(10),
    bySprint: true
  };

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

  $scope.$watch('metricalSettings', function (newValue, oldValue) {
    var setting = {
      projectKey: newValue.projectKey,
      sprintNumber: newValue.sprintNumber,
      issueTypes: newValue.issueTypes,
      version: newValue.version,
      startDate: newValue.startDate,
      endDate: newValue.endDate,
      bySprint: newValue.bySprint
    };

    setInLocalStorage('metricalSettings', setting);
  }, true);

  function initialize() {
    $scope.metricalSettings = commonService.getSettingsMetrical();
    $scope.issueTypesProject = null;
    $scope.versionsProjectMetrica = null;
    $scope.sprintsByProjects = null;
    LoadProjects();
    LoadChart();
  }

  /*$scope.selectables = [
    1, 2, 3
  ];*/


  $scope.shoutReset = function () {
    alert("value was reset!");
  };

  function LoadProjects() {
    var response = bugPrioridadService.getProyectos();
    response.then(function (data) {
      $scope.projects = data.items;
    });
  }

  $scope.SelectionVersion = function (newValue, oldValue) {
    $scope.metricalSettings.version = newValue.name;
    setInLocalStorage('metricalSettings', $scope.metricalSettings);

//Actualizamos para detalle
    $scope.metricalDetailSettings.version = newValue.name;    
    setInLocalStorage('metricalDetailSettings', $scope.metricalDetailSettings);
  }

  $scope.SelectionSprint = function (newValue, oldValue) {
    $scope.metricalSettings.sprintNumber = newValue.id;
    setInLocalStorage('metricalSettings', $scope.metricalSettings);

    //Actualizamos para detalle
    $scope.metricalDetailSettings.sprint = newValue.name;    
    setInLocalStorage('metricalDetailSettings', $scope.metricalDetailSettings);
  }

  $scope.SelectionTypeIssue = function (newValue, oldValue) {
    $scope.metricalSettings.issueTypes = newValue.name;
    setInLocalStorage('metricalSettings', $scope.metricalSettings);

    //Actualizamos para detalle
    $scope.metricalDetailSettings.issueTypes = newValue.name;
    $scope.metricalDetailSettings.titleDetail = "Detalle de " + $scope.metricalSettings.issueTypes + " por prioridad";
    setInLocalStorage('metricalDetailSettings', $scope.metricalDetailSettings);
  }

  $scope.loadSprintNumbers = function (newValue, oldValue) {

    
    $scope.metricalSettings.projectKey = newValue.key;
    $scope.issueTypesProject = newValue.issuetypes.items;
    var response = commonService.getSprintNumbersByProject(newValue.key);
    response.then(function (data) {
      $scope.sprintsByProjects = data.items;
    });

    var responseVersionsProject = bugPrioridadService.getVersions(newValue.key)
    responseVersionsProject.then(function (data) {
      $scope.versionsProjectMetrical = data.items;
    });

    //Actualizamos para detalle
    $scope.metricalDetailSettings.project = newValue.name;    
    setInLocalStorage('metricalDetailSettings', $scope.metricalDetailSettings);
  }

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




  $scope.checkedOrNot = function (isCheckedSprint) {
    $scope.metricalSettings.bySprint = (isCheckedSprint === 'sprint') ? true : false;
  }

  function LoadChart() {
    /* $scope.porPrioridades = [
         ['Bloqueadora', 1],
         ['Menor', 8],
         ['Mayor', 10],
         ['Trivial', 6],
         ['Critica', 5]];
         $scope.texto = "Grafico de errores por prioridad ";
       $scope.limitedPrioridades = $scope.porPrioridades;
   */

    $scope.texto = "";
    $scope.limitedPrioridades = null;

    if (($scope.metricalSettings.projectKey != -1) && ($scope.metricalSettings.sprintNumber != -1) &&
      ($scope.metricalSettings.issueTypes != "") && ($scope.metricalSettings.version != "")) {

      $scope.texto = "Grafico de " + $scope.metricalSettings.issueTypes + " por prioridad ";
      var response = bugPrioridadService.getMetricsByTypeIssueByPriority($scope.metricalSettings)
      response.then(function (data) {
          var dataNotFilter = data.items.select(function (item) {
          return item.priority.name;
        });

        var auxgroup = groupBy(dataNotFilter, function (priority) {
          return [priority];
        });
        var auxformato = auxgroup.select(function (params) {
          return [params[0], params.length];
        });
        $scope.limitedPrioridades = auxformato;

      });
    }
  }
})
