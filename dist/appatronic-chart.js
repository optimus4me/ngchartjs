(function () {
    'use strict';
    angular.module('builder.chartjs', []);

    angular.module('builder.chartjs')
        .factory('chartjsservice', chartjsservice)
        .directive('builderChart', ['chartjsservice', BuilderChart]);

    function BuilderChart(chartjsservice) {
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
                var canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                var context = $element[0].getContext("2d");
                var chart = chartjsservice.achart(context);
                var builderChart;

                $scope.$on('$destroy', function () {
                    if (builderChart) {
                        builderChart.destroy();
                    }
                });
                $scope.$watch("data", function (value) {
                    if (value) {
                        if (builderChart) {
                            builderChart.destroy();
                        }
                        if ($scope.type) {
                            builderChart = chartjsservice.resolve(chart, $scope.type, $scope.data, $scope.options);
                        }
                        builderChart.resize();
                    }
                }, true);
            }
        }
    }

    function chartjsservice() {
        var service = {
            achart: function achart(context) {

                return new Chart(context);
            },
            resolve: function resolve(achart, type, data, options) {
                var chartType = GetChart(type);
                if (chartType) {
                    if (chartType === "LBar") {
                        return achart.Overlay(data, options);
                    } else {
                        return achart[chartType](data, options);
                    }

                } else {
                    throw 'Please specify chart type in the attribute';
                }

                function GetChart(type) {
                    switch (type) {
                    case "line":
                        return "Line";

                    case "bar":
                        return "Bar";

                    case "radar":
                        return "Radar";

                    case "polararea":
                        return "PolarArea";
                    case "pie":
                        return "Pie";
                    default:
                        return;
                    }
                }

            }
        }
        return service;

    }
})();