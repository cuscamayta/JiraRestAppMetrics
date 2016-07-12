app.directive('chartsDirective', function($window, $rootScope) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            settings: "=",
            titlechart: "="
        },
        link: function(scope, element, attrs) {
            init();

            function init() {
                setChart();
            }

            function setChart() {
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                switch (attrs.type) {
                    case 'pie':
                        pieChart();
                        break;
                    default:
                        lineChart();
                        break;
                }
            }

            function pieChart() {
                scope.chart = new Highcharts.Chart({
                    credits: {
                        enabled: false
                    },
                    chart: {
                        renderTo: element[0],
                        spacingBottom: 15,
                        spacingTop: 40,
                        spacingLeft: 15,
                        spacingRight: 15,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    title: {
                        text: scope.titlechart,
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
                            depth: 35,
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
                                formatter: function() {
                                    return this.percentage.toFixed(1) + ' %';
                                }
                            }
                        }
                    }
                });
                scope.chart.addSeriesPie = function(series, title) {
                    if(title)
                    scope.chart.setTitle({
                        text: title
                    });
                    this.addSeries({
                        name: 'Porcentaje',
                        type: 'pie',
                        data: series
                    }, true);
                    scope.chart.renderTo = element[0];
                }
                scope.settings = scope.chart;
            }

            function lineChart() {
                scope.chart = new Highcharts.Chart({
                    chart: {
                        renderTo: attrs.id,
                        zoomType: 'x'
                    },
                    xAxis: {
                        type: 'dateTime',

                        labels: {
                            format: '{value:%b-%Y}'
                        },
                        startOnTick: true,
                        showFirstLabel: false,
                        minTickInterval: 3600 * 24 * 30 * 1000,//time in milliseconds
                        minRange: 3600 * 24 * 30 * 1000,
                        ordinal: false
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%b - %Y',
                                    new Date(this.x)) + '<br/>' + Math.round(this.y * 100) / 100;
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Valor'
                        }
                    },
                    title: {
                        text: ''
                    },
                    series: {},
                    exporting: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    },
                    credits: {
                        enabled: false
                    }
                });
                scope.settings = scope.chart;

            }

        }
    };
});