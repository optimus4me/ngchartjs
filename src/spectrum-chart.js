/*!
 * SPECTRUM CHARTJS
 *
 * Version: 1.0.0
 * https://github.com/optimus4me/spectrumchartjs
 * Copyright 2015 Riju Vashisht
 * Released under the MIT license
 * License - https://github.com/optimus4me/spectrumchartjs/blob/master/LICENSE
 */
(function () {
    'use strict';
    angular.module('spectrum.chartjs', []);

    angular.module('spectrum.chartjs')
        .factory('chartjsservice', chartjsservice)
        .directive('spectrumLineChart', ['chartjsservice', SpectrumLineChart])
        .directive('spectrumBarChart', ['chartjsservice', SpectrumBarChart])
        .directive('spectrumPieChart', ['chartjsservice', SpectrumPieChart])
        .directive('spectrumLineBarChart', ['chartjsservice', SpectrumLineBarChart])
        .directive('spectrumChart', ['chartjsservice', SpectrumRadarChart])
        .directive('spectrumPolarAreaChart', ['chartjsservice', SpectrumPolarAreaChart])
        .directive('spectrumChart', ['chartjsservice', SpectrumChart]);

    function SpectrumLineChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'line');
        return directive;
    }

    function SpectrumBarChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'bar');
        return directive;
    }

    function SpectrumPieChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'pie');
        return directive;
    }

    function SpectrumLineBarChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'lbar');
        return directive;
    }

    function SpectrumRadarChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'radar');
        return directive;
    }

    function SpectrumPolarAreaChart(chartjsservice) {
        var directive = new DirectiveResolver(chartjsservice, 'polarArea');
        return directive;
    }

    function SpectrumChart(chartjsservice) {
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
                height: "=chartHeight",
                callBack: "&method"
            },
            link: function ($scope, $element, $attrs) {

                var canvas = $element[0];
                if ($scope.height) {
                    canvas.height = $scope.height;
                } else {
                    canvas.height = $scope.height = $element[0].parentElement.clientHeight;
                }
                canvas.width = $element[0].parentElement.clientWidth;
                var context = canvas.getContext("2d");
                var chart = chartjsservice.achart(context);
                var spectrumChart;
                angular.element(window).on('resize', function () {
                    if (spectrumChart) {
                        if ($attrs.type || chartType) {
                            var options = spectrumChart.options;
                            spectrumChart.destroy();
                            spectrumChart = chartjsservice.resolve(chart, $attrs.type || ChartTypes[chartType], $scope.data, options);
                        }
                        spectrumChart.chart.height = $element[0].parentElement.clientHeight;
                        spectrumChart.chart.width = $element[0].parentElement.clientWidth;
                        spectrumChart.resize();
                    }
                });
                $scope.$on('$destroy', function () {
                    if (spectrumChart) {
                        spectrumChart.destroy();
                    }
                });
                $scope.$watch("data", function (data) {
                    if (data) {
                        if (spectrumChart) {
                            spectrumChart.destroy();
                        }
                        if ($attrs.type || chartType) {
                            spectrumChart = chartjsservice.resolve(chart, $attrs.type || ChartTypes[chartType], $scope.data, $scope.options);
                        }
                        spectrumChart.resize();
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