(function () {
    'use strict';
    angular.module('appatronic.chartjs', []);

    angular.module('appatronic.chartjs')
        .factory('chartjsservice', chartjsservice)
        .directive('appatronicChart', ['chartjsservice', AppatronicChart]);

    function AppatronicChart(chartjsservice) {
        return {
            restrict: 'EA',
            scope: {
                data: '=chartData',
                options: '=chartOptions',
                type: '=chartType',
                legend: '=chartLegend',
                chart: '=chart'
            },
            link: function ($scope, $element, $attrs) {
                console.log($attrs.type);
                var canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                var context = $element[0].getContext("2d");
                var chart = chartjsservice.achart(context);
                var appatronicChart;

                $scope.$on('$destroy', function () {
                    if (appatronicChart) {
                        appatronicChart.destroy();
                    }
                });
                $scope.$watch("data", function (value) {
                    if (value) {
                        if (appatronicChart) {
                            appatronicChart.destroy();
                        }
                        if ($scope.type) {
                            appatronicChart = chartjsservice.resolve(chart, $scope.type, $scope.data, $scope.options);
                        }
                        appatronicChart.resize();
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