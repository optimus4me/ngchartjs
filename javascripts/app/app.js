(function(){
'use strict';
    
    angular.module('app',[]);
    
    angular.module('app')
    .controller('MainCtrl',['$scope',MainCtrl]);
    
    function MainCtrl($scope){
     $scope.value = "Angular works on Git";
    }
})();