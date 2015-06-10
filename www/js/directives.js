angular.module('digitel.directives', [])

.directive('input', [function () {
  'use strict';

  var directiveDefinitionObject = {
    restrict: 'E',
    require: '?ngModel',
    link: function postLink(scope, iElement, iAttrs, ngModelController) {
      if (iAttrs.value && ngModelController) {
        ngModelController.$setViewValue(iAttrs.value);
      }
    }
  };

  return directiveDefinitionObject;
}])
.directive('hcPie', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    controller: function ($scope, $element, $attrs) {
    },
    template: '<div id="container" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs) {
      chart = new Highcharts.Chart({
        chart: {
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        credits:false,
        title: {
          text: ''
        },
        tooltip: {
          enabled:false
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            dataLabels: {
              enabled: false
            },
              startAngle: -90,
              endAngle: 90
          }
        },
        series: [{
          type: 'pie',
          name: 'Browser share',
            innerSize:'50%',
          data: scope.items
        }]
      });
      scope.$watch("items", function (newValue) {
        chart.series[0].setData(newValue, true);
      }, true);
    }
  }
});
