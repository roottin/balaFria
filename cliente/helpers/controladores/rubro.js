angular.module('balafria')
.controller('ctrlRubro', ['$scope','$state', function ($scope,$state) {
  $scope.enviar = function(){
    console.log($scope.formRubro.apellido);
  };
}]);
