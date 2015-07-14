(function () {
    'use strict';
    angular.module('builder.chartjs', []);

    angular.module('builder.chartjs')
        .factory('chartjsservice', chartjsservice)
        .directive('builderLineChart', ['chartjsservice', BuilderLineChart])
        .directive('builderBarChart', ['chartjsservice', BuilderBarChart])
        .directive('builderPieChart', ['chartjsservice', BuilderPieChart])
        .directive('builderLineBarChart', ['chartjsservice', BuilderLineBarChart])
        .directive('builderChart', ['chartjsservice', BuilderRadarChart])
        .directive('builderPolarAreaChart', ['chartjsservice', BuilderPolarAreaChart])
        .directive('builderChart', ['chartjsservice', BuilderChart]);

    function BuilderLineChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'line');
        return directive;
    }

    function BuilderBarChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'bar');
        return directive;
    }

    function BuilderPieChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'pie');
        return directive;
    }

    function BuilderLineBarChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'lbar');
        return directive;
    }

    function BuilderRadarChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'radar');
        return directive;
    }

    function BuilderPolarAreaChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'polarArea');
        return directive;
    }

    function BuilderChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, null);
        return directive;
    }

    function DirectiveResolver(chartjsservice, chartType) {
        var ChartTypes = {
            "line": "Line",
            "bar": "Bar",
            "lbar": "LBar",
            "radar": "Radar",
            "pie": "Pie",
            "doughnut": "Doughnut",
            "polarArea": "PolarArea"
        }

        return {
            restrict: 'EA',
            scope: {
                data: '=chartData',
                options: '=chartOptions',
                type: '=chartType',
                legend: '=chartLegend',
                chart: '=chart',
                callBack: "&method"
            },
            link: function ($scope, $element, $attrs) {

                var context = $element[0].getContext("2d");
                var chart = chartjsservice.achart(context);
                var builderChart;

                $scope.$on('$destroy', function () {
                    if (builderChart) {
                        builderChart.destroy();
                    }
                });
                $scope.$watch("data", function (data) {
                    if (data) {
                        if (builderChart) {
                            builderChart.destroy();
                        }
                        if ($attrs.type || chartType) {
                            builderChart = chartjsservice.resolve(chart, $attrs.type || ChartTypes[chartType], $scope.data, $scope.options);
                        }
                        builderChart.resize();
                    }
                }, true);
            }
        };
    }

    function chartjsservice() {
        var service = {
            achart: function achart(context) {
                return new Chart(context);
            },
            resolve: function resolve(achart, type, data, options) {
                if (type) {
                    if (type === "LBar") {
                        return achart.Overlay(data, options);
                    } else {
                        return achart[type](data, options);
                    }
                } else {
                    throw 'Please specify chart type in the attribute';
                }
            }

        }
        return service;

    }
})();