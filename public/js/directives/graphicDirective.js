app.directive('hcPie', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '=',
      titulo: '='
    },
    controller: function ($scope, $element, $attrs) {

    },
    template: '<div id="container" style="margin: 0 auto ">not working</div>',
    link: function (scope, element, attrs) {
      var chart = new Highcharts.Chart({
        credits: {
          enabled: false
        },
        chart: {
          spacingBottom: 15,
          spacingTop: 40,
          spacingLeft: 15,
          spacingRight: 15,
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: scope.titulo,
          floating: true,
          x: 0,
          y: -15
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
          percentageDecimals: 1
        },
        plotOptions: {
          pie: {
            showInLegend: true,
            size: "100%",
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              distance: 5,
              size: "100%",
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return this.percentage.toFixed(1) + ' %';
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Porcentaje',
          data: scope.items
        }]
      });
      scope.$watch("items", function (newValue) {
        chart.series[0].setData(newValue, true);
      }, true);

      scope.$watch("titulo", function (newValue) {
        chart.setTitle({ text: newValue });
      }, true);
    }
  }
});